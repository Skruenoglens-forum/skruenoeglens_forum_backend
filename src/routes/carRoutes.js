const express = require("express");
const multer = require("multer");
const carController = require("../controllers/carController");
const authMiddleware = require("../middleware/authMiddleware");
const storage = require("../utils/storageConfig");

const router = express.Router();

const upload = multer({ storage });

router.route("/")
    .get(carController.getAll)                                                              // GET all cars
    .post(authMiddleware.roleCheck(false), upload.single("file"), carController.create);    // POST create new car

router.route("/:id")
    .get(carController.getById)                                                             // GET car by ID
    .put(authMiddleware.roleCheck(false), upload.single("file"), carController.update)      // PUT update car by ID
    .delete(authMiddleware.roleCheck(false), carController.delete);                         // DELETE delete car by ID

router.get("/users/:id", carController.getAllByUserId);                                     // GET all cars by UserId

router.get("/:id/image", carController.getImageById);                                       // GET image by ID

module.exports = router;
