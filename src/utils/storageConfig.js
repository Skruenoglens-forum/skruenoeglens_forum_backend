// storageConfig.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        // Extract file extension
        const ext = path.extname(file.originalname);
        // Generate UUID and attach file extension
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

module.exports = storage;