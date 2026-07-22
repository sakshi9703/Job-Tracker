import multer from "multer";
import path from "path";

const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

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
