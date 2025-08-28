import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/profile");

    // Create folder if it doesn’t exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage });
