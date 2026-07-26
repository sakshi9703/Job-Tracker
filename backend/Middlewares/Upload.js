import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Services/cloudinary.js";

const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return cb(new Error("Only PDF, DOC, and DOCX resumes are allowed."));
    }

    cb(null, true);
  },
});

export default upload;
