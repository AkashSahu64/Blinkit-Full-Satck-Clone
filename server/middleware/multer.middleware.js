import multer from 'multer';
import path from 'path';

// Memory storage for multer
const storage = multer.memoryStorage();

// Supported file formats
const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Multer configuration with file size limit and format validation
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new Error('Unsupported file format'));
    }
    cb(null, true);
  },
});

export default upload;
