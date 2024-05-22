const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// GET all categories
router.get('/', categoryController.getall);

module.exports = router;