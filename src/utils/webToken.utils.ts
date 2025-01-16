import jwt from 'jsonwebtoken'
import { EnvironmentConfiguration } from '../config/env.config'
import { IJwtOptions, IJwtPayload, JwtVerified } from '../interfaces/jwt.interface'
import { autoInjectable } from 'tsyringe'
import { ROLE } from '../constants/enum'

@autoInjectable()
export class WebToken {
  sign(user: IJwtPayload, options: IJwtOptions, role: ROLE) {
    return jwt.sign(
      {
        id: user.id,
        role,
      },
      options.secret,
      {
        expiresIn: options.expiresIn,
      }
    )
  }

  verify<T extends JwtVerified>(token: string, secret: string) {
    return jwt.verify(token, secret) as T
  }

  generateTokens(user: IJwtPayload, role: ROLE) {
    const accessToken = this.sign(
      user,
      {
        expiresIn: EnvironmentConfiguration.ACCESS_TOKEN_EXPIRES_IN,
        secret: EnvironmentConfiguration.ACCESS_TOKEN_SECRET,
      },
      role
    )
    const refreshToken = this.sign(
      user,
      {
        expiresIn: EnvironmentConfiguration.REFRESH_TOKEN_EXPIRES_IN,
        secret: EnvironmentConfiguration.REFRESH_TOKEN_SECRET,
      },
      role
    )
    return { accessToken, refreshToken }
  }
}
