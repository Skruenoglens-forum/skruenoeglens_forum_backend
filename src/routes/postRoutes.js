const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all posts
router.get('/', postController.getall);

// GET specific post by ID
router.get('/:id', postController.getById);

// GET all posts by UserId
router.get('/users/:id', postController.getAllByUserId);

// GET all posts by CategoryId
router.get('/categories/:id', postController.getAllByCategoryId);

// POST create a new post
router.post('/', authMiddleware.userAuth, postController.create);

// PUT update a post by ID
router.put('/:id', authMiddleware.userAuth, postController.update);

// DELETE delete a post by ID
router.delete('/:id', authMiddleware.userAuth, postController.delete);

module.exports = router;