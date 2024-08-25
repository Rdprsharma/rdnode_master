const multer = require('multer');
const path = require('path');

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where videos will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Export multer instance
module.exports = upload;