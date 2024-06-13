const commentModel = require("../models/commentModel");
const auth = require("../utils/auth");

class CommentController {
    async getall(req, res) {
        try {
            const comments = await commentModel.getAllComments();
            res.json(comments);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getById(req, res) {
        const commentId = req.params.id;
        try {
            const comment = await commentModel.getCommentById(commentId);
            if (!comment) {
                res.status(404).json({ error: "Kunne ikke finde kommentar" });
            }
            res.json(comment);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAllByPostId(req, res) {
        const postId = req.params.id;
        try {
            const comments = await commentModel.getAllCommentsByPostId(postId);
            res.json(comments);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async create(req, res) {
        const token = req.header("Authorization");
        const { description, parentId } = req.body;
        const postId = req.params.id;

        try {
            const decoded = auth.verifyToken(token);
            const newComment = await commentModel.createComment(description, decoded.uid, postId, parentId);
            res.status(201).json(newComment);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async update(req, res) {
        const commentId = req.params.id;
        const { description } = req.body;
        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);
            const isUserOwnerOfComment = await commentModel.isUserOwnerOfComment(decoded.uid, commentId);
            if (!isUserOwnerOfComment && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(400).json({ error: "Dette er ikke din kommentar" });
            }

            const updatedComment = await commentModel.updateComment(description, commentId);
            if (!updatedComment) {
                return res.status(404).json({ error: "Kunne ikke finde kommentar" });
            }

            res.json(updatedComment);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async markAsSolution(req, res) {
        const commentId = req.params.id;
        const isSolution = req.params.isSolution;
        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);
            const isUserOwnerOfPost = await commentModel.isUserOwnerOfPost(commentId, decoded.uid);
            if (!isUserOwnerOfPost && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(403).json({ error: "Dette er ikke din kommentar" });
            }
            const markedComment = await commentModel.markCommentAsSolution(commentId, isSolution);
            if (!markedComment) {
                return res.status(404).json({ error: "Kunne ikke finde kommentar" });
            }
            res.json(markedComment);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async delete(req, res) {
        const commentId = req.params.id;
        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);
            const isUserOwnerOfComment = await commentModel.isUserOwnerOfComment(decoded.uid,commentId);
            if (!isUserOwnerOfComment && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(403).json({ error: "Dette er ikke din kommentar" });
            }
            const deletedComment = await commentModel.deleteComment(commentId);
            if (!deletedComment) {
                return res.status(404).json({ error: "Kunne ikke finde kommentar" });
            }
            res.json({ message: "Comment deleted successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new CommentController();
