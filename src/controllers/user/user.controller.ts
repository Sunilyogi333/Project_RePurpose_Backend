import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { UserService } from '../../services/user/user.service';
import cloudinaryService from '../../services/cloudinary.service';
import { createResponse } from '../../utils/response';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';

@injectable()
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Current user fetched successfully', user));
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch current user');
    }
  }

  async editProfilePicture(req: Request, res: Response): Promise<void> {
    const profilePath = req.file?.path;

    if (!profilePath) {
      throw HttpException.BadRequest('Profile picture is required');
    }

    try {
      // Delete the existing profile picture from Cloudinary if it exists
      if (req.user.profilePicture) {
        await cloudinaryService.deleteImage(req.user.profilePicture);
      }

      // Upload the new image
      const imageResult = await cloudinaryService.uploadImage(profilePath);
      if (!imageResult) {
        throw HttpException.NotFound('Image upload to Cloudinary failed');
      }

      // Update user profile picture
      const updatedUser = await this.userService.updateUser(req.user._id, {
        profilePicture: imageResult.secure_url,
      });

      console.log("updated user", updatedUser)

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Profile picture updated successfully', updatedUser));
    } catch (error) {
      throw HttpException.InternalServer('Error updating profile picture');
    }
  }

  async editAccountDetails(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, phoneNumber } = req.body;

    if (!firstName || !lastName || !phoneNumber) {
      throw HttpException.BadRequest('All fields are required');
    }

    try {
      // Update user details
      const updatedUser = await this.userService.updateUser(req.user._id, {
        firstName,
        lastName,
        phoneNumber,
      });

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'User details updated successfully', updatedUser));
    } catch (error) {
      throw HttpException.InternalServer('Error updating account details');
    }
  }
    
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Users fetched successfully', users));
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch users');
    }
  }
}
