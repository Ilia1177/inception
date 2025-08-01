// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set your upload password
const UPLOAD_PASSWORD = "secret123";

// Set up multer storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Serve HTML form
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Parse form data

// Handle upload with password check
app.post('/upload', (req, res, next) => {
  if (req.body.password !== UPLOAD_PASSWORD) {
    return res.status(401).send('Unauthorized: Wrong password');
  }
  next();
}, upload.single('myFile'), (req, res) => {
  res.send('✅ File uploaded successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

