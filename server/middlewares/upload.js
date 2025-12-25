import multer from 'multer';
import path from 'path';

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 172345234.png
  },
});

// File filter
function fileFilter(req, file, cb) {
  const allowed = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
    'image/webp',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, JPEG, PNG, SVG, WEBP allowed'), false);
}

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
