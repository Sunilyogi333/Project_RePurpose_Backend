import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dwaf3uzd5',
  api_key: process.env.CLOUD_API_KEY || '121557529677688',
  api_secret: process.env.CLOUD_API_SECRET || 'O8IhTeXjx8e8EKOGqXKHiLsE79w',
});

// console.log(cloudinary);

export default cloudinary;
