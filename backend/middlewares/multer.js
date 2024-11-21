import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the folder path
const imagesDir = path.join(__dirname, 'images');

// Check if the images folder exists, and create it if it doesn't
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true }); // The 'recursive' option ensures that parent directories are also created if they don't exist.
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
