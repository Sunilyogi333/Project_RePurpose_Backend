import cloudinary from '../config/cloudinary.config'
import fs from 'fs';

class CloudinaryService {
  // Upload image to Cloudinary
  async uploadImage(localFilePath: string): Promise<any | null> {
    try {
      if (!localFilePath) {
        console.log('Local path is missing');
        return null;
      }

      // Uploading file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        folder: 'child-thrift-store',
        resource_type: 'auto',
      });

      console.log('File uploaded to Cloudinary successfully', response.url);
      fs.unlinkSync(localFilePath); // Delete local file after upload

      return response;
    } catch (error: unknown) {
      // Type guard to check if the error is an instance of Error
      if (error instanceof Error) {
        console.log('Error uploading file to Cloudinary', error.message);
      } else {
        console.log('An unknown error occurred');
      }
      fs.unlinkSync(localFilePath); // Delete local file after failed upload
      return null;
    }
  }

  // Delete image from Cloudinary
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      const result = await cloudinary.uploader.destroy(`child-thrift-store/${publicId}`);

      if (result.result === 'ok') {
        console.log('Image deleted from Cloudinary:', publicId);
        return true;
      } else {
        console.error('Failed to delete image:', publicId);
        return false;
      }
    } catch (error: unknown) {
      // Type guard to check if the error is an instance of Error
      if (error instanceof Error) {
        console.error('Error deleting image from Cloudinary:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
      return false;
    }
  }

  // Extract public ID from Cloudinary URL
  private extractPublicIdFromUrl(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  }
}

export default new CloudinaryService();
