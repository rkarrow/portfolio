import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory for PDFs (client/public/pdfs)
const uploadDir = path.join(__dirname, '../../client/public/pdfs');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
  console.log('📄 PDF file filter - filename:', file.originalname);
  console.log('📄 PDF file filter - mimetype:', file.mimetype);
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfExtension = ext === '.pdf';
  const isPdfMimeType = file.mimetype === 'application/pdf' || 
                        file.mimetype === 'application/x-pdf' ||
                        file.mimetype.includes('pdf');

  if (isPdfExtension && isPdfMimeType) {
    console.log('✅ PDF file accepted');
    return cb(null, true);
  } else {
    console.log('❌ PDF file rejected - extension:', ext, 'mimetype:', file.mimetype);
    cb(new Error('Only PDF files are allowed (.pdf extension required)'));
  }
};

const uploadPdf = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for PDFs
  },
  fileFilter: fileFilter
});

export default uploadPdf;
