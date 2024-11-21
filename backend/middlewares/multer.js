import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the folder path for images
const imagesDir = path.join(__dirname, 'images');

// Check if the images folder exists, and create it if it doesn't
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true }); // 'recursive: true' ensures parent directories are created if needed.
}

let filename = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesDir); // Save to 'images' folder
    },
    filename: (req, file, cb) => {
        console.log(file);
        filename = JSON.stringify(Date.now()) + file.originalname;
        cb(null, filename);
        req.file_name = filename;
    }
});

const upload = multer({ storage: storage });

export default upload;
