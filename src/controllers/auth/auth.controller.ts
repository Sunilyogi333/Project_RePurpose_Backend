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
import sendEmail from '../../services/email.service'
import generateOtp from '../../utils/generateOtp'
import OTP from '../../models/otp.model'
import Token from '../../models/token.model'
import * as crypto from 'crypto'

@injectable()
export class AuthController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async register(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body
    const storeName = req.body?.storeName || ''
    const address = req.body?.address || ''

    const userData = { firstName, lastName, email, password, role, phoneNumber, storeName, address }
    const newUser = await this.userService.createUser(userData)

    const otp = generateOtp()

    const otpDocument = new OTP({
      userID: newUser._id,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })
    await otpDocument.save()

    // Send OTP email
    const emailContent = `<p>Dear ${firstName},</p>
                          <p>Your OTP for email verification is: <b>${otp}</b></p>
                          <p>This OTP is valid for 10 minutes.</p>`
    await sendEmail(email, 'Email Verification OTP', emailContent)

    res.status(StatusCodes.CREATED).json(
      createResponse(true, StatusCodes.CREATED, 'Verification Email Sent', {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      })
    )
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { userID, otp } = req.body
    console.log('req body', req.body)

    try {
      // Validate request
      if (!userID || !otp) {
        throw HttpException.BadRequest('User ID and OTP are required.')
      }

      console.log('userID', userID)

      // Find the OTP record
      const otpRecord = await OTP.findOne({ userID: userID })
      if (!otpRecord) {
        throw HttpException.NotFound('OTP record not found.')
      }

      // Check if the OTP is expired
      if (otpRecord.expiresAt.getTime() < Date.now()) {
        throw HttpException.BadRequest('OTP has expired.')
      }

      // Verify the OTP
      const isOtpValid = await otpRecord.isOtpCorrect(otp)
      if (!isOtpValid) {
        throw HttpException.Unauthorized('Invalid OTP.')
      }

      // OTP is valid, proceed with user verification
      const updatedUser = await this.userService.updateUser(userID, { isEmailVerified: true })

      // Remove the OTP record after successful verification
      await OTP.deleteOne({ userId: userID })

      // Send success response
      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'Email verified and user successfully updated', {
          id: updatedUser?._id,
          firstName: updatedUser?.firstName,
          lastName: updatedUser?.lastName,
          email: updatedUser?.email,
          role: updatedUser?.role,
          isEmailVerified: updatedUser?.isEmailVerified,
        })
      )
    } catch (error) {
      console.error('Error during OTP verification:', error)
      throw HttpException.InternalServer('Unable to verify OTP')
    }
  }

  // Resend OTP to user if email is verified
  async resendOTP(req: Request, res: Response): Promise<void> {
    const { userID } = req.body

    try {
      // Validate request
      if (!userID) {
        throw HttpException.BadRequest('User ID is required.')
      }

      // Find the user by userID
      const user = await this.userService.findUserById(userID)
      if (!user) {
        throw HttpException.NotFound('User not found.')
      }

      // Check if the user is already verified
      if (user.isEmailVerified) {
        throw HttpException.BadRequest('Email already verified.')
      }

      // Check if the user already has an OTP
      const existingOtp = await OTP.findOne({ userID: user._id })
      if (existingOtp) {
        // If an OTP already exists, delete it
        await OTP.deleteOne({ userID: user._id })
      }

      // Generate new OTP
      const otp = generateOtp()

      // Create a new OTP record for the user
      const otpDocument = new OTP({
        userID: user._id,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
      })
      await otpDocument.save()

      // Send OTP email
      const emailContent = `<p>Dear ${user.firstName},</p>
                            <p>Your OTP for email verification is: <b>${otp}</b></p>
                            <p>This OTP is valid for 5 minutes.</p>`
      await sendEmail(user.email, 'Email Verification OTP', emailContent)

      // Send response
      res.status(StatusCodes.SUCCESS).json(
        createResponse(true, StatusCodes.SUCCESS, 'OTP resent successfully', {
          userID: user._id,
          firstName: user.firstName,
          email: user.email,
        })
      )
    } catch (error) {
      console.error('Error during OTP resend:', error)
      throw HttpException.InternalServer('Unable to resend OTP')
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    // Find the user by email
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw HttpException.Unauthorized('Invalid email or password')
    }

    // Check if the email is verified
    if (!user.isEmailVerified) {
      res.status(StatusCodes.FORBIDDEN).json(
        createResponse(
          false,
          StatusCodes.FORBIDDEN,
          'Email is not verified. Please verify your email before logging in.',
          {
            isEmailVerified: false,
          }
        )
      )
      return
    }

    // Validate the password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw HttpException.Unauthorized('Invalid email or password')
    }

    // Generate tokens
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    // Save the refresh token to the user's record
    user.refreshToken = refreshToken
    await user.save()

    // Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Send the response
    res.status(StatusCodes.SUCCESS).json(
      createResponse(true, StatusCodes.SUCCESS, 'Login successful', {
        id: user._id,
        token: accessToken,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
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

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body

    try {
      if (!email) {
        throw HttpException.BadRequest('Email is required.')
      }

      // Check if user exists
      const user = await this.userService.findByEmail(email)
      if (!user) {
        throw HttpException.NotFound('No user found with this email.')
      }

      const uniqueString = crypto.randomBytes(32).toString('hex')
      const token = new Token({
        userId: user._id,
        uniqueString,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Token expires in 15 minutes
      })

      await token.save()

      const resetLink = `${EnvironmentConfiguration.CLIENT_URL}/reset-password/${token.generateToken()}`
      await sendEmail(
        user.email,
        'Password Reset Request',
        `Click the link below to reset your password:\n\n${resetLink}`
      )

      res.status(200).json(createResponse(true, StatusCodes.SUCCESS, 'Password reset link sent to your email.'))
    } catch (error) {
      throw HttpException.InternalServer('Failed to password reset link')
    }
  }

  async resetForgottenPassword(req: Request, res: Response): Promise<Response> {
    const { token, newPassword } = req.body

    try {
      const payload: any = jwt.verify(token, EnvironmentConfiguration.VERIFICATION_TOKEN_SECRET)
      const existingToken = await Token.findOne({ userId: payload.userId })

      if (!existingToken) {
        throw HttpException.BadRequest('Invalid or expired token.')
      }

      const isValid = await existingToken.isUniqueStringCorrect(payload.uniqueString)
      if (!isValid) {
        throw HttpException.BadRequest('Invalid token')
      }

      const user = await this.userService.findUserById(payload.userId)
      if (!user) {
        throw HttpException.NotFound('User not found')
      }

      user.password = newPassword // Make sure password hashing is handled in the user schema
      await user.save() // Save the updated user

      await Token.deleteOne({ userId: payload.userId })

      return res.status(StatusCodes.SUCCESS).json(createResponse(true, 200, 'Password changed successfully.'))
    } catch (error) {
      console.log('An error occured', error)
      throw HttpException.InternalServer('Internal Server Error')
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const { oldPassword, newPassword } = req.body
    const userId = req.user._id

    try {
      const user = await this.userService.findUserById(userId)

      if (!user) {
        throw HttpException.NotFound('User not found')
      }

      const isMatch = await user.isPasswordCorrect(oldPassword)
      if (!isMatch) {
        throw HttpException.BadRequest('Old password is incorrect')
      }

      user.password = newPassword // Make sure password hashing is handled in the user schema
      await user.save() // Save the updated user

      res.status(StatusCodes.SUCCESS).json(createResponse(true, 200, 'Password changed successfully.'))
    } catch (error) {
      console.log('An error occurred', error)
      throw HttpException.InternalServer('Internal Server Error')
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
