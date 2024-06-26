const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

module.exports = storage;
