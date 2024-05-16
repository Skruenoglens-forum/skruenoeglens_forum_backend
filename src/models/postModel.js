const db = require('../utils/db');

class PostModel {
  async getAllPosts() {
    try {
      const query = `
        SELECT *
        FROM post
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      throw error;
    }
  }

  async getPostById(postId) {
    try {
      const query = `
        SELECT *
        FROM post
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
        FROM post
        WHERE userId = ?
      `;
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getPostByUserId:', error);
      throw error;
    }
  }

  async isUserOwnerOfPost(userId, postId) {
    try {
      const query = `
        SELECT * FROM post 
        WHERE userId = ? AND id = ?
      `;
      const [rows] = await db.query(query, [userId, postId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error in isUserOwnerOfPost:', error);
      throw error;
    }
  }
  
  async createPost(title, userid, description, brand, motor, firstRegistration, model, type, parentId) {
    try {
      const query = `
        INSERT INTO post (userId, title, description, carBrand, carModel, carMotor, carType, carFirstRegistration, parentId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [userid, title, description, brand, model, motor, firstRegistration, type, parentId]);
      const insertedId = result.insertId;
      const newPost = await this.getPostById(insertedId);
      return newPost;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  async updatePost(postid, title, description) {
    try {
      const query = `
        UPDATE post
        SET title = ?, description = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [title, description, postid]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedPost = await this.getPostById(Postid)
      return updatedPost ;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      const query = `
        DELETE FROM post WHERE id = ?
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
