const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", commentController.getall);                                                                  // GET all comments

router.route("/:id")
    .get(commentController.getById)                                                                         // GET comment by ID
    .put(authMiddleware.roleCheck(false), commentController.update)                                         // PUT update comment by ID
    .delete(authMiddleware.roleCheck(false), commentController.delete);                                     // DELETE delete comment by ID

router.route("/posts/:id")
    .get(commentController.getAllByPostId)                                                                  // GET all comments by PostId
    .post(authMiddleware.roleCheck(false), commentController.create);                                       // POST create new comment

router.put("/:id/solution/:isSolution", authMiddleware.roleCheck(false), commentController.markAsSolution); // PUT mark comment as solution by ID

module.exports = router;
