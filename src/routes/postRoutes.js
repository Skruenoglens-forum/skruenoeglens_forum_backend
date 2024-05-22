const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all posts
router.get('/', postController.getall);

// GET specific post by ID
router.get('/:id', postController.getById);

// GET all posts by UserId
router.get('/user/:id', postController.getAllByUserId);

// GET all posts by CategoryId
router.get('/category/:id', postController.getAllByCategoryId);

// GET all comments by PostId
router.get('/:id/comments', postController.getAllCommentsByPostId);

// POST create a new post
router.post('/', authMiddleware.accountAuth, postController.create);

// PUT update a post by ID
router.put('/:id', authMiddleware.accountAuth, postController.update);

// DELETE delete a post by ID
router.delete('/:id', authMiddleware.accountAuth, postController.delete);

module.exports = router;