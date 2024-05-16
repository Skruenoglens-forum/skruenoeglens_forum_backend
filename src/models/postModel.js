const db = require('../utils/db');

class PostModel {
  async getAllPosts() {
    try {
      const query = `
        SELECT *
        FROM Posts
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      throw error;
    }
  }

  async getPostsById(postId) {
    try {
      const query = `
        SELECT *
        FROM Posts
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [postId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  }

  async getPostByUserId(userId) {
    try {
      const query = `
        SELECT *
        FROM Post
        WHERE Userid = ?
      `;
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getPostByUserId:', error);
      throw error;
    }
  }

  
  async createPost(title, userid,description, Motor, ModelYear, Model, Type, ParentId) {
    try {
      const query = `
        INSERT INTO users (UserId, Title, Description, Motor, ModelYear, Model, Type, ParentId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [userid, title,description, Motor, ModelYear, Model, Type, ParentId]);
      const insertedId = result.insertId;
      const newPost = await this.getUserById(insertedId);
      return newPost;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  async updatePost(Postid, title, description) {
    try {
      const query = `
        UPDATE Post
        SET title = ?, description = ? WHERE Postid = ?
      `;
      const [result] = await db.query(query, [title, description, Postid]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedPost = await this.getPostsById(Postid)
      return updatedPost ;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  

  async deletePost(postId) {
    try {
      const query = `
        DELETE FROM Post WHERE postid = ?
      `;
      const [result] = await db.query(query, [postId]);
      if (result.affectedRows === 0) {
        return null;
      }
      return true;
    } catch (error) {
      console.error('Error in deletepost:', error);
      throw error;
    }
  }
}

module.exports = new PostModel();
