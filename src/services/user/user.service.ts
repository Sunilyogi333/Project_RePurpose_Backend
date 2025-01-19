import User from '../../models/user.model';
import { IUser } from '../../interfaces/user.interface';
import HttpException from '../../utils/HttpException';

export class UserService {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findByRefreshToken(refreshToken: string) {
    return User.findOne({ refreshToken });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.findByEmail(userData.email!);
    if (existingUser) {
      throw HttpException.Conflict('Email already in use');
    }

    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }  

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }  

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw HttpException.NotFound('User not found');
    }
  }
}

