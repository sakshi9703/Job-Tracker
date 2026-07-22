import fs from "fs";
import path from "path";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";

const cleanResumeText = (text) =>
  text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\s+/g, " ")
    .trim();

export const parseResume = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const parser = new pdfParse.PDFParse({ data: buffer });
    const result = await parser.getText();

    return cleanResumeText(result.text);
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });

    return cleanResumeText(result.value);
  }

  if (extension === ".doc") {
    const extractor = new WordExtractor();
    const document = await extractor.extract(filePath);

    return cleanResumeText(document.getBody());
  }

  throw new Error("Unsupported resume format.");
};
