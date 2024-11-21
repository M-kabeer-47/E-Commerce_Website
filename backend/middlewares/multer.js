// uploadMiddleware.js

import multer from 'multer';

// Multer memory storage
const storage = multer.memoryStorage();

// Multer upload middleware
const upload = multer({ storage: storage });

export default upload;
