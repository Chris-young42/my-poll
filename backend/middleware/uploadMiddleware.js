const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename for the uploaded file
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes =['image/jpeg','image/png','image/jpg'] // Define allowed file types (e.g., image files)
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file if its type is allowed
    } else {
        cb(new Error('Invalid file type'), false); // Reject the file if its type is not allowed
    }
}

const upload = multer({ storage, fileFilter });
module.exports = upload;
