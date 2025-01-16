// src/config/multer.config.ts
import multer from 'multer';
import path from 'path';

// Define storage settings for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'public/temp/'); // Save files in the 'public/temp' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create a Multer instance with the storage configuration
const upload = multer({ storage });

export default upload;
