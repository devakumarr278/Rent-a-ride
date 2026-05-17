import multer from "multer";
import DatauriParser from "datauri/parser.js";

const storage = multer.memoryStorage();
// configure multer to upload multiple named file fields
export const multerUploads = multer({ storage }).array("image", 3);

const parser = new DatauriParser();

const normalizeFiles = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  return Object.values(files).flat();
};

const buildDataUri = (file) => {
  const mimeType = file.mimetype || "application/octet-stream";
  const base64 = Buffer.from(file.buffer).toString("base64");
  return `data:${mimeType};base64,${base64}`;
};

export const dataUri = (files) => {
  const encodedFiles = [];
  const normalizedFiles = normalizeFiles(files);
  normalizedFiles.forEach((cur) => {
    const dataUri = buildDataUri(cur);
    encodedFiles.push({ data: dataUri, filename: cur.originalname });
  });
  return encodedFiles;
};

// configure multer to upload multiple named file fields
export const multerMultipleUploads = multer({ storage }).fields([
  { name: "image", maxCount: 3 },
  { name: "insurance_image", maxCount: 1 },
  { name: "rc_book_image", maxCount: 1 },
  { name: "polution_image", maxCount: 1 },
]);

// converting buffer to base64
export const base64Converter = (files) => {
  const encodedFiles = [];
  const normalizedFiles = normalizeFiles(files);
  normalizedFiles.forEach((cur) => {
    const dataUri = buildDataUri(cur);
    encodedFiles.push({ data: dataUri, filename: cur.originalname });
  });
  return encodedFiles;
};


