import { Request, Response } from 'express'
import { injectable } from 'tsyringe'
import Store from '../../models/store.model'
import User from '../../models/user.model'
import { StatusCodes } from '../../constants/statusCodes'
import { createResponse } from '../../utils/response'
import HttpException from '../../utils/HttpException'
import cloudinaryService from '../../services/cloudinary.service'
import { SELLER_KYC_STATUS } from '../../constants/enum'
import sendEmail from '../../services/email.service'

@injectable()
export class StoreController {
  async createStoreKYC(req: Request, res: Response): Promise<void> {
    const { storeName, ownerName, email, phoneNumber, storeAddress, storeNumber, businessRegNumber } = req.body
    const userID = req.user._id // Assuming the user ID is attached to the request after authentication
    const files = req.files as {
      passportPhoto?: Express.Multer.File[]
      businessRegCertificate?: Express.Multer.File[]
      storeFrontImage?: Express.Multer.File[]
    }

    try {
      // Validate required files
      if (!files.passportPhoto || !files.businessRegCertificate || !files.storeFrontImage) {
        throw HttpException.BadRequest('All KYC images are required.')
      }

      // Upload files to Cloudinary
      const uploadedImages = await Promise.all([
        cloudinaryService.uploadImage(files.passportPhoto[0].path),
        cloudinaryService.uploadImage(files.businessRegCertificate[0].path),
        cloudinaryService.uploadImage(files.storeFrontImage[0].path),
      ])

      // Ensure all images were successfully uploaded
      if (uploadedImages.some((result) => !result)) {
        throw HttpException.InternalServer('Failed to upload one or more images.')
      }

      // Destructure uploaded image URLs
      const [passportPhotoURL, businessRegCertificateURL, storeFrontImageURL] = uploadedImages.map(
        (result) => result.secure_url
      )

      // Check if the user already has a store
      const existingStore = await Store.findOne({ userID })
      if (existingStore) {
        throw HttpException.Conflict('User already has a store.')
      }

      // Create store data
      const storeData = {
        userID,
        storeName,
        ownerName,
        email,
        phoneNumber,
        storeAddress,
        storeNumber,
        businessRegNumber,
        passportPhoto: passportPhotoURL,
        businessRegCertificate: businessRegCertificateURL,
        storeFrontImage: storeFrontImageURL,
      }

      // Save store to the database
      const newStore = await Store.create(storeData)

      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { storeStatus: SELLER_KYC_STATUS.PENDING }, // Assuming you have defined SELLER_KYC_STATUS.PENDING
        { new: true }
      )

      if (!updatedUser) {
        throw HttpException.NotFound('User not found.')
      }

      res
        .status(StatusCodes.CREATED)
        .json(createResponse(true, StatusCodes.CREATED, 'Store KYC created successfully', newStore))
    } catch (error) {
      console.error('Error in createStoreKYC:', error)
      throw error instanceof HttpException ? error : HttpException.InternalServer('Failed to create store KYC')
    }
  }

  async getMyStoreKYC(req: Request, res: Response): Promise<void> {
    const userId = req.user._id // Assuming `req.user` contains the authenticated user's details

    try {
      // Find the KYC form associated with the authenticated user
      const kycForm = await Store.findOne({ userID: userId })
      console.log('kyc form here', kycForm)

      if (!kycForm) {
        throw HttpException.NotFound('No KYC form found for this user.')
      }

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'KYC form retrieved successfully', kycForm))
    } catch (error) {
      console.error('Error in getUserKYC:', error)
      throw error instanceof HttpException ? error : HttpException.InternalServer('Failed to retrieve KYC form')
    }
  }

  async getPendingStores(req: Request, res: Response): Promise<void> {
    try {
      // Fetch only stores with status 'pending'
      const pendingStores = await Store.find({ status: 'pending' })

      // Check if there are any pending stores
      if (!pendingStores.length) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json(createResponse(false, StatusCodes.NOT_FOUND, 'No pending stores found', []))
        return
      }

      // Respond with the pending stores
      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Pending stores fetched successfully', pendingStores))
    } catch (error) {
      console.error('Error fetching pending stores:', error)
      throw HttpException.InternalServer('Failed to fetch pending stores')
    }
  }

  async getStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await Store.find()

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Stores fetched successfully', stores))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to fetch stores')
    }
  }

  async approveStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params

    try {
      // Find the store by ID
      const store = await Store.findById(storeId)
      if (!store) {
        throw HttpException.NotFound('Store not found')
      }

      // Update the user's store status to "approved"
      await User.findByIdAndUpdate(store.userID, { storeStatus: SELLER_KYC_STATUS.APPROVED })

      // Update the store's status to "pending"
      store.status = SELLER_KYC_STATUS.APPROVED
      await store.save()

      // Send email notification
      const emailContent = `<p>Dear ${store.storeName},</p>
    <p>Congratulations! Your store has been approved and is now live on our platform.</p>
    <p>You can start managing your store and adding products.</p>`
      await sendEmail(store.email, 'Store Approval Notification', emailContent)

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Store status updated to pending successfully'))
    } catch (error) {
      console.error('Error approving store:', error)
      throw HttpException.InternalServer('Failed to approve store')
    }
  }

  async rejectStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params

    try {
      const store = await Store.findByIdAndDelete(storeId)
      if (!store) {
        throw HttpException.NotFound('Store not found')
      }

      // Send email notification
      const emailContent = `<p>Dear ${store.storeName},</p>
    <p>We regret to inform you that your store has been rejected and removed from our platform.</p>
    <p>If you have any questions or wish to appeal, please contact our support team.</p>`
      await sendEmail(store.email, 'Store Rejection Notification', emailContent)

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Store rejected and deleted successfully'))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to reject store')
    }
  }

  // Controller logic in `iocStoreController`
  async requestModificationStore(req: Request, res: Response): Promise<void> {
    try {
      const { storeId } = req.params // Extract the store ID from the route parameters
      console.log("req.body", req.body)
      const { modificationReason } = req.body // Optional rejection reason from the request body
      console.log('modification reason', modificationReason)

      // Find the store by ID

      const store = await Store.findById(storeId)
      if (!store) {
        throw HttpException.NotFound('Store not found')
      }

      await User.findByIdAndUpdate(store.userID, { storeStatus: SELLER_KYC_STATUS.PENDING })
      // Update the store's status to `pending`
      store.status = SELLER_KYC_STATUS.PENDING
      store.updatedAt = new Date() // Optionally update a timestamp for tracking

      // Save the updated store
      await store.save()

      // Send email notification
      const emailContent = `<p>Dear ${store.storeName},</p>
    <p>Your store requires modifications before it can be approved.</p>
    <p>Reason: ${modificationReason}</p>
    <p>Please make the necessary changes and resubmit your application.</p>`
      await sendEmail(store.email, 'Store Modification Request', emailContent)

      // Respond with a success message and the updated store object
      res.status(200).json({
        message: 'Store status updated to pending successfully',
        store,
      })
    } catch (error) {
      console.error('Error updating store status to pending:', error)
      res.status(500).json({ message: 'An error occurred while updating the store status' })
    }
  }

  async updateStoreKYC(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params // Store ID from the route parameter
    const updateFields = req.body // Updated fields from the frontend
    const files = req.files as {
      passportPhoto?: Express.Multer.File[]
      businessRegCertificate?: Express.Multer.File[]
      storeFrontImage?: Express.Multer.File[]
    }

    try {
      // Find the store by ID
      const store = await Store.findById(storeId)
      if (!store) {
        throw HttpException.NotFound('Store not found.')
      }

      // Handle uploaded files
      if (files.passportPhoto) {
        const passportPhotoResult = await cloudinaryService.uploadImage(files.passportPhoto[0].path)
        if (!passportPhotoResult) {
          throw HttpException.InternalServer('Failed to upload passport photo.')
        }
        updateFields.passportPhoto = passportPhotoResult.secure_url
      }

      if (files.businessRegCertificate) {
        const businessRegCertificateResult = await cloudinaryService.uploadImage(files.businessRegCertificate[0].path)
        if (!businessRegCertificateResult) {
          throw HttpException.InternalServer('Failed to upload business registration certificate.')
        }
        updateFields.businessRegCertificate = businessRegCertificateResult.secure_url
      }

      if (files.storeFrontImage) {
        const storeFrontImageResult = await cloudinaryService.uploadImage(files.storeFrontImage[0].path)
        if (!storeFrontImageResult) {
          throw HttpException.InternalServer('Failed to upload store front image.')
        }
        updateFields.storeFrontImage = storeFrontImageResult.secure_url
      }

      // Update store fields dynamically
      const updatedStore = await Store.findByIdAndUpdate(
        storeId,
        { $set: updateFields },
        { new: true, runValidators: true }
      )

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Store KYC updated successfully', updatedStore))
    } catch (error) {
      console.error('Error in updateStoreKYC:', error)
      throw error instanceof HttpException ? error : HttpException.InternalServer('Failed to update store KYC')
    }
  }

  async getStore(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params

    try {
      const store = await Store.findById(storeId)
      if (!store) {
        throw HttpException.NotFound('Store not found')
      }

      res
        .status(StatusCodes.SUCCESS)
        .json(createResponse(true, StatusCodes.SUCCESS, 'Store fetched successfully', store))
    } catch (error) {
      console.error(error)
      throw HttpException.InternalServer('Failed to fetch store')
    }
  }
}
