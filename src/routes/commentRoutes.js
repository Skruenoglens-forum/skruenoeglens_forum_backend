const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all comments
router.get('/', commentController.getall);

// GET comment by ID
router.get('/:id', commentController.getById);

// GET all comments by PostId
router.get('/posts/:id', commentController.getAllByPostId);

// POST create a new comment
router.post('/posts/:id', authMiddleware.userAuth, commentController.create);

// PUT update a comment by ID
router.put('/:id', authMiddleware.userAuth, commentController.update);

// PUT mark comment as solution by ID
router.put('/:id/solution/:isSolution', authMiddleware.userAuth, commentController.solution);

// DELETE delete a comment by ID
router.delete('/:id', authMiddleware.userAuth, commentController.delete);

module.exports = router;