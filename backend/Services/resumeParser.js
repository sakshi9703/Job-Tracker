import fs from "fs";
import * as pdfParse from "pdf-parse";

export const parseResume = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = new pdfParse.PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  const cleanText = result.text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleanText;
};