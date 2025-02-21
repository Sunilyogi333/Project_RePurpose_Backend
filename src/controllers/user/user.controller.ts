import { Request, Response } from 'express'
import { injectable } from 'tsyringe'
import { UserService } from '../../services/user/user.service'
import cloudinaryService from '../../services/cloudinary.service'
import { createResponse } from '../../utils/response'
import { StatusCodes } from '../../constants/statusCodes'
import HttpException from '../../utils/HttpException'
import User from '../../models/user.model'
import { IUser } from '../../interfaces/user.interface'

@injectable()
export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user
      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Current user fetched successfully', user))
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch current user')
    }
  }

  async editProfilePicture(req: Request, res: Response): Promise<void> {
    const profilePath = req.file?.path

    if (!profilePath) {
      throw HttpException.BadRequest('Profile picture is required')
    }

    try {
      // Delete the existing profile picture from Cloudinary if it exists
      if (req.user.profilePicture) {
        await cloudinaryService.deleteImage(req.user.profilePicture)
      }

      // Upload the new image
      const imageResult = await cloudinaryService.uploadImage(profilePath)
      if (!imageResult) {
        throw HttpException.NotFound('Image upload to Cloudinary failed')
      }

      // Update user profile picture
      const updatedUser = await this.userService.updateUser(req.user._id, {
        profilePicture: imageResult.secure_url,
      })

      console.log('updated user', updatedUser)

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Profile picture updated successfully', updatedUser))
    } catch (error) {
      throw HttpException.InternalServer('Error updating profile picture')
    }
  }

  async editAccountDetails(req: Request, res: Response): Promise<void> {
    console.log('req.body', req.body)
    const { firstName, lastName, about, phoneNumber, address, facebook, instagram, tiktok, twitter } = req.body

    try {
      // Prepare update object
      const updateData: Record<string, any> = {
        firstName,
        lastName,
        phoneNumber,
        address,
        about,
        socialMediaHandles: {
          facebook,
          instagram,
          tiktok,
          twitter,
        },
      }

      console.log('updateData', updateData)

      // Update user details
      const updatedUser = await this.userService.updateUser(req.user._id, updateData)
      console.log("updatedUser", updatedUser)

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'User details updated successfully', updatedUser))
    } catch (error) {
      throw HttpException.InternalServer('Error updating account details')
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers()
      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Users fetched successfully', users))
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch users')
    }
  }

  async allUsers(req: Request, res: Response): Promise<void> {
    try {
      console.log('req.query', req.query)

      const { search } = req.query
      console.log('search', search)
      console.log('req.user', req.user)

      const users = await User.find({
        email: search,
        _id: { $ne: req.user._id }, // Exclude the authenticated user
      })

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Users retrieved successfully', users))
    } catch (error) {
      console.error('User fetch error:', error)
      throw HttpException.InternalServer('Error occurred while fetching users')
    }
  }

  async getUserWithRoleSeller(req: Request, res: Response): Promise<void> {
    // Fetch only stores with status 'pending'
    const sellers: IUser[] = await User.find({ role: 'seller' }).select('-password -storeName -refreshToken -isEmailVerified -isProfileCompleted -storeStatus -isGoogleUser -googleId')
    
    console.log("seller", sellers);

    // Check if there are any pending stores
    if (!sellers.length) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse(false, StatusCodes.NOT_FOUND, 'No seller found', []))
      return
    }

    // Respond with the pending stores
    res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'seller Details fetched successfully', sellers))
  }

  async getUserWithRoleStore(req: Request, res: Response): Promise<void> {
    // Fetch only stores with status 'pending'
    const stores: IUser[] = await User.find({ role: 'store' }).select('-password -refreshToken -totalRewardPoints -isEmailVerified -isProfileCompleted -isGoogleUser -googleId')
    
    console.log("seller", stores);

    // Check if there are any pending stores
    if (!stores.length) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse(false, StatusCodes.NOT_FOUND, 'No seller found', []))
      return
    }

    // Respond with the pending stores
    res
      .status(StatusCodes.SUCCESS)
      .json(createResponse(true, StatusCodes.SUCCESS, 'seller Details fetched successfully', stores))
  }

  async deleteUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  
    // Delete the user
    await User.findByIdAndDelete(userId);
  
    res.status(StatusCodes.SUCCESS).json( createResponse(true, StatusCodes.SUCCESS, "User deleted successfully", user));
  }
}
