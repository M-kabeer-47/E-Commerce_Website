import multer from 'multer'; 



let filename = ""
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        filename=JSON.stringify(Date.now())+file.originalname
        cb(null,filename)
        req.file_name = filename;
    }
})
const upload = multer({storage:storage})
export default upload;