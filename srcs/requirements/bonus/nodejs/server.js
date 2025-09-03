const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

function validateEnv() {
  const requiredVars = ['UPLOAD_PASS'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
}

validateEnv();

function startServer() {
  console.log('===== NODE SERVER STARTING ===== V2');

  // Configuration
  const uploadDir = process.env.UPLOAD_DIR || './uploads'; // Use relative path
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/x-png', 'application/zip', 'application/pdf', 'text/plain'];
  const app = express();
  const port = process.env.NODE_PORT || 3000;
  const UPLOAD_PASS = process.env.UPLOAD_PASS;

  // Debug: show ENV vars
  console.log('Environment Variables:', {
    PORT: process.env.NODE_PORT,
    UPLOAD_PASS: process.env.UPLOAD_PASS ? UPLOAD_PASS : 'NOT SET',
    UPLOAD_DIR: process.env.UPLOAD_DIR
  });

  // Debug: show actual request
  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  // Ensure upload directory exists with error handling
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created upload directory: ${uploadDir}`);
    }
    console.log(`Upload directory ready: ${uploadDir}`);
  } catch (err) {
    console.error('Failed to create upload directory:', err);
    process.exit(1);
  }

  // Middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
  });
  // middleware to handle multipart headers
  app.use((req, res, next) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      // Skip body parsing for file uploads
      next();
    } else {
      // Use standard body parsing for other requests
      express.json()(req, res, next);
    }
  });
  // Add request logging for debugging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Password check middleware - always return JSON for API consistency
  const checkPassword = (req, res, next) => {
    const providedPass = req.body.password || req.query.password || req.headers['x-upload-password'];
    console.log("Password issue: (checkPassword)", providedPass, "==?", UPLOAD_PASS);
    if (!providedPass || providedPass !== UPLOAD_PASS) {
      return res.status(401).json({ error: 'Invalid upload password' });
    }
    next();
  };

  // Multer Configuration
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      // Use original filename without sanitization
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });


  const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Provide more detailed error
      const error = new Error(
        `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`
      );
      error.status = 400;
      cb(error, false);
    }
  };

  const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter
  });

  // Routes
  app.post('/upload', async (req, res) => {
    try {
      console.log('Upload request received - headers:', req.headers);

      const providedPass = req.body.password || req.query.password || req.headers['x-upload-password'];
      if (!providedPass || providedPass !== UPLOAD_PASS) {
        console.log('Invalid password attempt');
        return res.status(401).json({ error: 'Invalid upload password' });
      }

      const processUpload = () => new Promise((resolve, reject) => {
        upload.single('myFile')(req, res, (err) => {
          if (err) {
            console.error('Multer error details:', {
              message: err.message,
              stack: err.stack,
              code: err.code,
              field: err.field
            });
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await processUpload();

      if (!req.file) {
        throw new Error('No file received');
      }

      console.log('File processed successfully:', req.file);

      return res.json({
        success: true,
        filename: req.file.filename,
        size: req.file.size,
        url: `/download/${req.file.filename}`
      });

    } catch (err) {
      console.error('UPLOAD ERROR:', err.stack || err);
      return res.status(500).json({ 
        error: 'File processing failed',
        details: err.message 
      });
    }
  });

  app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    console.log(`Download request for: ${filename}`);
    console.log('Raw filename:', filename);
    console.log('Encoded filename:', encodeURIComponent(filename));
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return res.status(404).json({ error: 'File not found' });
    }

    // Don't set JSON content-type for file downloads
    res.download(filePath, (err) => {
      if (err) {
        console.error('Download failed:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      } else {
        console.log(`Download successful: ${filename}`);
      }
    });
  });

  app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error('Error reading upload directory:', err);
        return res.status(500).json({ 
          error: 'Failed to read files',
          details: err.message 
        });
      }

      // Filter out any system files (like .DS_Store on Mac)
      const filteredFiles = files.filter(file => !file.startsWith('.'));

      if (filteredFiles.length === 0) {
        return res.json({ files: [] });
      }

      // Get file details for each file
      const fileList = filteredFiles.map(file => {
        try {
          const filePath = path.join(uploadDir, file);
          const stats = fs.statSync(filePath);
          
          return {
            name: file,
            url: `/download/${encodeURIComponent(file)}`,
            size: stats.size,
            lastModified: stats.mtime
          };
        } catch (err) {
          console.error(`Error processing file ${file}:`, err);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from errors

      res.json({ files: fileList });
    });
  });

  app.get('/status', (req, res) => {
    res.json({ 
      status: 'OK', 
      uploadDir, 
      maxFileSize: '100MB',
      allowedTypes: allowedFileTypes 
    });
  });

  app.get('/check-files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      res.json({
        path: uploadDir,
        files: files || [],
        exists: fs.existsSync(uploadDir)
      });
    });
  });

  // Error handling middleware (should be after all routes)
  app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  });

  // 404 handler (should be last)
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Upload directory: ${uploadDir}`);
    console.log(`Upload password: ${UPLOAD_PASS ? 'Set (hidden)' : 'Not set!'}`);
    console.log(`Allowed file types: ${allowedFileTypes.join(', ')}`);
  });
}

startServer();
