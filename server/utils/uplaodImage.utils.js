import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageCloudinary = async (image) => {
  try {
    // Check if the image buffer exists
    const buffer = image?.buffer;
    if (!buffer) throw new Error('Invalid image buffer');

    // Upload the image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'blinkit', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return result;
  } catch (error) {
    console.error('Error in uploadImageCloudinary:', error.message || error);
    throw new Error('Failed to upload image');
  }
};

export default uploadImageCloudinary;
