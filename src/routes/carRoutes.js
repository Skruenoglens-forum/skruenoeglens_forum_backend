const express = require('express');
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all cars
router.get('/', carController.getAll);

// GET specific car by ID
router.get('/:id', carController.getById);

// GET all cars by UserId
router.get('/user/:id', carController.getAllByUserId);

// POST create a new car
router.post('/', authMiddleware.accountAuth, carController.create);

// PUT update a car by ID
router.put('/:id', authMiddleware.accountAuth, carController.update);

// DELETE delete a user by ID
router.delete('/:id', authMiddleware.accountAuth, carController.delete);

module.exports = router;
