import bcrypt from 'bcryptjs'

export class BcryptService {
  static async hash(password: string): Promise<string> {
    let salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
