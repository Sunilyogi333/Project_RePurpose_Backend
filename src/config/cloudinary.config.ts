import { v2 as cloudinary } from 'cloudinary';
import { EnvironmentConfiguration } from './env.config';

cloudinary.config({
  cloud_name: EnvironmentConfiguration.CLOUD_NAME,
  api_key: EnvironmentConfiguration.CLOUD_API_KEY,
  api_secret: EnvironmentConfiguration.CLOUD_API_SECRET,
});

// console.log(cloudinary);

export default cloudinary;
