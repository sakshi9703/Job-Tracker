import path from "path";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

const cleanResumeText = (text) =>
  text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\s+/g, " ")
    .trim();

export const parseResume = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".pdf") {
    const parser = new pdfParse.PDFParse({
      data: file.buffer,
    });

    const result = await parser.getText();

    return cleanResumeText(result.text);
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return cleanResumeText(result.value);
  }

  throw new Error("Only PDF and DOCX resumes are supported.");
};