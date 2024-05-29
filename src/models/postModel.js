const db = require('../utils/db');

class PostModel {
  async getAllPosts() {
    try {
      const query = `
        SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name
        FROM post
        JOIN users ON post.user_id = users.id
        JOIN category ON post.category_id = category.id
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

  async getAllPostsByUserId(userId) {
    try {
      const query = `
        SELECT *
        FROM post
        WHERE user_id = ?
      `;
      const [rows] = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Error in getAllPostsByUserId:', error);
      throw error;
    }
  }

  async getAllPostsByCategoryId(categoryId) {
    try {
      const query = `
        SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name
        FROM post
        JOIN users ON post.user_id = users.id
        JOIN category ON post.category_id = category.id
        WHERE category_id = ?
      `;
      const [rows] = await db.query(query, [categoryId]);
      return rows;
    } catch (error) {
      console.error('Error in getAllPostsByCategoryId:', error);
      throw error;
    }
  }
  async getAllPostsByCategoryIdAndLicensePlate(categoryId,brandNavn,modelNavn){
    try{
      const query =`
      SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name, 
        FROM post
        JOIN users ON post.user_id = users.id
        JOIN category ON post.category_id = category.id
        WHERE category_id = ? AND (car_brand= ? OR car_model ?)`
    
    const [rows] =await db.query(query, [categoryId,brandNavn, modelNavn])
    return rows
    }
    catch(error){
      console.error('Error in getAllPostsByCategoryIdAndLicensePlate')
      throw error
    }
  }

  async isUserOwnerOfPost(userId, postId) {
    try {
      const query = `
        SELECT * FROM post 
        WHERE user_id = ? AND id = ?
      `;
      const [rows] = await db.query(query, [userId, postId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error in isUserOwnerOfPost:', error);
      throw error;
    }
  }
  
  async createPost(userId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId) {
    try {
      const query = `
        INSERT INTO post (user_id, title, description, car_brand, car_motor, car_first_registration, car_model, car_type, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [userId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId]);
      const insertedId = result.insertId;
      const newPost = await this.getPostById(insertedId);
      return newPost;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  async updatePost(postId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId) {
    try {
      const query = `
        UPDATE post
        SET title = ?, description = ?, car_brand = ?, car_motor = ?, car_first_registration = ?, car_model = ?, car_type = ?, category_id = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId, postId]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedPost = await this.getPostById(postId)
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
