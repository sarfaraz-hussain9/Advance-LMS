import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for both types
  },
  fileFilter: (req, file, cb) => {
    // Accept both images and videos
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },
}).single("file");

export default singleUpload;
