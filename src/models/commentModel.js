const db = require("../utils/db");

class commentModel {
    async getAllComments() {
    const query = `
        SELECT *
        FROM comment
    `;
    return await db.queryDatabase(query);
    }

    async getCommentById(commentId) {
        const query = `
            SELECT *
            FROM comment
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [commentId]);
        return rows[0];
    }

    async getAllCommentsByPostId(postId) {
        const query = `
            SELECT comment.*, users.name, users.id AS user_id
            FROM comment
            LEFT JOIN users ON comment.user_id = users.id
            WHERE comment.post_id = ?;
        `;
        return await db.queryDatabase(query, [postId]);
    }

    async isUserOwnerOfComment(userId, commentId) {
        const query = `
            SELECT *
            FROM comment 
            WHERE user_id = ? AND id = ?
        `;
        const rows = await db.queryDatabase(query, [userId, commentId]);
        return rows.length > 0;
    }

    async createComment(description, userId, postId, parentId) {
        const query = `
            INSERT INTO comment (description, solution, user_id, post_id, parent_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.queryDatabase(query, [description, 0, userId, postId, parentId]);
        const insertedId = result.insertId;
        const newPost = await this.getCommentById(insertedId);
        return newPost;
    }

    async updateComment(description, commentId) {
        const query = `
            UPDATE comment
            SET description = ?
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [description, commentId]);
        if (result.affectedRows === 0) {
            return null;
        }
        const updatedComment = await this.getCommentById(commentId);
        return updatedComment;
    }

    async markCommentAsSolution(commentId, isSolution) {
        const query = `
            UPDATE comment
            SET solution = ?
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [isSolution, commentId]);
        if (result.affectedRows === 0) {
            return null;
        }
        const updatedComment = await this.getCommentById(commentId);
        return updatedComment;
    }

    async isUserOwnerOfPost(commentId, userId) {
        const query = `
            SELECT comment.id AS comment_id, post.id AS post_id, post.user_id AS post_user_id
            FROM comment
            JOIN post ON comment.post_id = post.id
            WHERE comment.id = ? AND post.user_id = ?
        `;
        const rows = await db.queryDatabase(query, [commentId, userId]);
        return rows.length > 0;
    }

    async removeUser(userId) {
        const query = `
            UPDATE comment
            SET user_id = null
            WHERE user_id = ?
        `;
        const result = await db.queryDatabase(query, [userId]);
        if (result.affectedRows === 0) {
            return null;
        }
        const updatedComment = await this.getPostById(userId);
        return updatedComment;
    }

    async deleteComment(commentId) {
        const query = `
            DELETE
            FROM comment
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [commentId]);
        if (result.affectedRows === 0) {
            return null;
        }
        return true;
    }
}

module.exports = new commentModel();
