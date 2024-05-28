const db = require('../utils/db');

class commentModel {
  async getAllComments() {
    try {
      const query = `
        SELECT *
        FROM comment
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllComments:', error);
      throw error;
    }
  }

  async getCommentById(commentId) {
    try {
      const query = `
        SELECT *
        FROM comment
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [commentId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  }

  async getAllCommentsByPostId(postId) {
    try {
      const query = `
        SELECT comment.*, users.name, users.id AS user_id
        FROM comment
        JOIN users ON comment.user_id = users.id
        WHERE comment.post_id = ?;
      `;
      const [rows] = await db.query(query, [postId]);
      return rows;
    } catch (error) {
      console.error('Error in getAllCommentsByPostId:', error);
      throw error;
    }
  }

  async isUserOwnerOfComment(userId, commentId) {
    try {
      const query = `
        SELECT * FROM comment 
        WHERE user_id = ? AND id = ?
      `;
      const [rows] = await db.query(query, [userId, commentId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error in isUserOwnerOfComment:', error);
      throw error;
    }
  }
  
  async createComment(description, userId, postId, parentId) {
    try {
      const query = `
        INSERT INTO comment (description, user_id, post_id, parent_id)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [description, userId, postId, parentId]);
      const insertedId = result.insertId;
      const newPost = await this.getCommentById(insertedId);
      return newPost;
    } catch (error) {
      console.error('Error in createComment:', error);
      throw error;
    }
  }

  async updateComment(description, commentId) {
    try {
      const query = `
        UPDATE comment
        SET description = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [description, commentId]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedComment = await this.getCommentById(commentId)
      return updatedComment ;
    } catch (error) {
      console.error('Error in updateComment:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      const query = `
        DELETE FROM comment WHERE id = ?
      `;
      const [result] = await db.query(query, [commentId]);
      if (result.affectedRows === 0) {
        return null;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    }
  }
}

module.exports = new commentModel();
