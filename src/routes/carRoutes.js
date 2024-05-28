const express = require('express');
const multer = require('multer');
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const storage = require('../utils/storageConfig');

const router = express.Router();

const upload = multer({ storage });

// GET all cars
router.get('/', carController.getAll);

// GET specific car by ID
router.get('/:id', carController.getById);

// GET all cars by UserId
router.get('/users/:id', carController.getAllByUserId);

// GET image by ID
router.get('/:id/image', carController.getImageById);

// POST create a new car
router.post('/', authMiddleware.userAuth, upload.single('file'), carController.create);

// PUT update a car by ID
router.put('/:id', authMiddleware.userAuth, carController.update);

// DELETE delete a user by ID
router.delete('/:id', authMiddleware.userAuth, carController.delete);

module.exports = router;
