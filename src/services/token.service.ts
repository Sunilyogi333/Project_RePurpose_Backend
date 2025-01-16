// tokenService.ts

import { WebToken } from '../utils/webToken.utils'
import { IUser } from '../interfaces/user.interface'

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
}
