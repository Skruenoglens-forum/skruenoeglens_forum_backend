const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const storage = require('../utils/storageConfig');

const router = express.Router();

const upload = multer({ storage });

// GET all users
router.get('/', userController.getAll);

// GET specific user by ID
router.get('/:id', userController.getById);

// GET profile image by ID
router.get('/:id/image', userController.getImageById);

// POST create a new user
router.post('/', upload.single('file'), userController.create);

// PUT update a user by ID
router.put('/:id', authMiddleware.userAuth, upload.single('file'), userController.update);

// PUT ban a user by ID
router.put('/:id/ban', authMiddleware.adminAuth, userController.ban);

// PUT un ban a user by ID
router.put('/:id/unban', authMiddleware.adminAuth, userController.unban);

// DELETE delete a user by ID
router.delete('/:id', authMiddleware.userAuth, userController.delete);

module.exports = router;
