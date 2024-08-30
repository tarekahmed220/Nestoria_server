import multer  from "multer";
import path from"path";

// Multer config=multer(storage,fileFilter);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads');
  },
  filename: (req, file, cb) => {
      // Specify the filename for the uploaded file
      //console.log(req.file?.path)
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|pjpeg|svg|webp|pjp|jfif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
};

// Initialize `multer` with the storage options and file filter
const upload =multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

export {upload}
  