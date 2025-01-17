// tokenService.ts

import { WebToken } from '../utils/webToken.utils'
import { IUser } from '../interfaces/user.interface'
import { OAuth2Client } from 'google-auth-library'

const webToken = new WebToken()

export class TokenService {
  static generateAccessToken(user: IUser): string {
    return webToken.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string,
        secret: process.env.ACCESS_TOKEN_SECRET as string,
      },
      user.role
    )
  }

  static generateRefreshToken(user: IUser): string {
    return webToken.sign(
      { id: user._id.toString() },
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string,
        secret: process.env.REFRESH_TOKEN_SECRET as string,
      },
      user.role
    )
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.CALLBACK_URL
      )
      oauth2Client.setCredentials({ refresh_token: refreshToken })
      const res = await oauth2Client.getAccessToken()
      return res.token || ''
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Error while refreshing access token')
    }
  }
}
