const express = require('express');
const multer = require('multer');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const storage = require('../utils/storageConfig');

const router = express.Router();

const upload = multer({ storage });

// GET all posts
router.get('/', postController.getall);

// GET specific post by ID
router.get('/:id', postController.getById);

// GET all posts by UserId
router.get('/users/:id', postController.getAllByUserId);

// GET all posts by CategoryId
router.get('/categories/:id', postController.getAllByCategoryId);
//GET all posts by CategoryId and Car

router.get('/categories/:id/:brand/:model',postController.getAllByCategoryIdAndLicensePlate)

router.get('/cars/:brand/:model', postController.getAllByLicensePlate)

// GET postImageId by postId
router.get('/:id/images', postController.getAllImagesById);

// GET image by postImageId
router.get('/image/:id', postController.getImageByImageId);

// POST create a new post
router.post('/', authMiddleware.userAuth, upload.array('images', 4), postController.create);

// PUT update a post by ID
router.put('/:id', authMiddleware.userAuth, upload.array('images', 4), postController.update);

// DELETE delete a post by ID
router.delete('/:id', authMiddleware.userAuth, postController.delete);

module.exports = router;