import { Request, Response } from 'express'
import { UserService } from '../../services/user/user.service'
import { createResponse } from '../../utils/response'
import { StatusCodes } from '../../constants/statusCodes'
import HttpException from '../../utils/HttpException'
import { injectable } from 'tsyringe'
import { ROLE } from '../../constants/enum'
import { EnvironmentConfiguration } from '../../config/env.config'
import axios from 'axios'
import jwt from 'jsonwebtoken'

@injectable()
export class AuthController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async register(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body

    const userData = { firstName, lastName, email, password, role, phoneNumber }
    const newUser = await this.userService.createUser(userData)

    res.status(StatusCodes.CREATED).json(
      createResponse(true, StatusCodes.CREATED, 'User registered successfully', {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      })
    )
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw HttpException.Unauthorized('Invalid email or password')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw HttpException.Unauthorized('Invalid email or password')
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(StatusCodes.SUCCESS).json(
      createResponse(true, StatusCodes.SUCCESS, 'Login successful', {
        id: user._id,
        token: accessToken,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || ROLE.MEMBER,
      })
    )
  }

  // async refresh(req: Request, res: Response): Promise<void> {
  //   const { refreshToken } = req.cookies;

  //   if (!refreshToken) {
  //     throw HttpException.Forbidden('No refresh token provided');
  //   }

  //   // Use the correct service method
  //   const user = await this.userService.findByRefreshToken(refreshToken);
  //   if (!user) {
  //     throw HttpException.Forbidden('Invalid refresh token');
  //   }

  //   // Generate new tokens
  //   const accessToken = await user.generateAccessToken();
  //   const newRefreshToken = await user.generateRefreshToken();

  //   // Save the new refresh token
  //   user.refreshToken = newRefreshToken;
  //   await user.save();

  //   // Set the new refresh token in a cookie
  //   res.cookie('refreshToken', newRefreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //   });

  //   res
  //     .status(StatusCodes.SUCCESS)
  //     .json(createResponse(true, StatusCodes.SUCCESS, 'Token refreshed', { token: accessToken }));
  // }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      throw HttpException.Forbidden('No refresh token provided')
    }

    // Fetch user by refreshToken
    const user = await this.userService.findByRefreshToken(refreshToken)
    if (!user) {
      throw HttpException.Forbidden('Invalid refresh token')
    }

    try {
      if (user.isGoogleUser) {
        // Case: Refresh token is from Google
        const googleResponse = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id: EnvironmentConfiguration.GOOGLE_CLIENT_ID,
            client_secret: EnvironmentConfiguration.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const newAccessToken = googleResponse.data.access_token

        res.status(StatusCodes.SUCCESS).json(
          createResponse(true, StatusCodes.SUCCESS, 'Token refreshed', {
            token: newAccessToken,
          })
        )
      } else {
        // Case: Refresh token is from your system
        const newAccessToken = await user.generateAccessToken()
        const newRefreshToken = await user.generateRefreshToken()

        // Save the new refresh token in the database
        user.refreshToken = newRefreshToken
        await user.save()

        // Set the new refresh token in the cookie
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(StatusCodes.SUCCESS).json(
          createResponse(true, StatusCodes.SUCCESS, 'Token refreshed', {
            token: newAccessToken,
          })
        )
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      throw HttpException.InternalServer('Unable to refresh token')
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    // This route only initiates Google authentication.
    res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Google Auth initiated'))
  }

  async googleAuthCallback(req: Request, res: Response): Promise<void> {
    const user = req.user as any

    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse(false, StatusCodes.UNAUTHORIZED, 'Authentication failed'))
      return
    }

    // Store Google refresh token
    const { googleRefreshToken } = user // Extracted during Google login
    user.refreshToken = googleRefreshToken
    user.isGoogleUser = true
    await user.save()

    // Generate JWT for internal use
    const token = jwt.sign({ id: user._id, email: user.email }, EnvironmentConfiguration.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    })

    res.status(StatusCodes.SUCCESS).json(
      createResponse(true, StatusCodes.SUCCESS, 'Authentication successful', {
        token,
      })
    )
  }

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      throw HttpException.BadRequest('No refresh token provided')
    }

    const user = await this.userService.findByRefreshToken(refreshToken)
    if (user) {
      user.refreshToken = undefined
      await user.save()
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Logout successful'))
  }

  async completeProfile(req: Request, res: Response): Promise<void> {
    const { userId, phoneNumber, role, storeName } = req.body

    try {
      // Update the user record
      const updatedUser = await this.userService.updateUser(userId, {
        phoneNumber,
        role,
        ...(role === 'Store' && { storeName }), // Add storeName only if role is "Store"
      })

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Profile updated successfully', updatedUser))
    } catch (error) {
      throw HttpException.InternalServer('Failed to update profile')
    }
  }
}
