const db = require("../utils/db");

class PostModel {
  async getAllPosts(sql, queryVars) {
    try {
      const query = `
      SELECT post.*, 
       users.name AS user_name, 
       users.id AS user_id, 
       category.name AS category_name, 
       IFNULL(comment_counts.comment_count, 0) AS comment_count, 
       GROUP_CONCAT(post_image.id) AS image_ids
        FROM post
        LEFT JOIN users ON post.user_id = users.id
        JOIN category ON post.category_id = category.id
        LEFT JOIN (SELECT post_id, COUNT(id) AS comment_count 
        FROM comment
        GROUP BY post_id) AS comment_counts ON post.id = comment_counts.post_id
        LEFT JOIN post_image ON post.id = post_image.post_id
        ${sql}
        GROUP BY post.id, users.id, category.id;

      `;
      const [rows] = await db.query(query, queryVars);
      return rows;
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      throw error;
    }
  }

  async getPostById(postId) {
    try {
      const query = `
        SELECT post.*, 
       users.name AS user_name, 
       users.id AS user_id, 
       category.name AS category_name, 
       IFNULL(comment_counts.comment_count, 0) AS comment_count, 
       GROUP_CONCAT(post_image.id) AS image_ids
      FROM post
      LEFT JOIN users ON post.user_id = users.id
      JOIN category ON post.category_id = category.id
      LEFT JOIN (SELECT post_id, COUNT(id) AS comment_count 
                FROM comment
                GROUP BY post_id) AS comment_counts ON post.id = comment_counts.post_id
      LEFT JOIN post_image ON post.id = post_image.post_id
      WHERE post.id = ?
      GROUP BY post.id, users.id, category.id;
      `;
      const [rows] = await db.query(query, [postId]);
      return rows[0];
    } catch (error) {
      console.error("Error in getPostById:", error);
      throw error;
    }
  }

  async getAllPostsByUserId(userId) {
    try {
      const query = `
        SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name, IFNULL(comment_counts.comment_count, 0) AS comment_count, GROUP_CONCAT(post_image.id) AS image_ids
        FROM post
        JOIN users ON post.user_id = users.id
        JOIN category ON post.category_id = category.id
        LEFT JOIN (SELECT post_id, COUNT(id) AS comment_count FROM comment
        GROUP BY post_id) AS comment_counts ON post.id = comment_counts.post_id
        LEFT JOIN post_image ON post.id = post_image.post_id
        WHERE user_id = ?
        GROUP BY post.id, users.id, category.id;
      `;
      const [rows] = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error in getAllPostsByUserId:", error);
      throw error;
    }
  }

  async getAllImagesByPostId(postId) {
    try {
      const query = `
        SELECT * FROM post_image
        WHERE post_id = ?
      `;
      const [rows] = await db.query(query, [postId]);
      return rows;
    } catch (error) {
      console.error("Error in getAllImagesByPostId:", error);
      throw error;
    }
  }

  async getImage(postImageId) {
    try {
      const query = `
        SELECT image
        FROM post_image
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [postImageId]);
      return rows[0];
    } catch (error) {
      console.error("Error in getImage:", error);
      throw error;
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
      console.error("Error in isUserOwnerOfPost:", error);
      throw error;
    }
  }

  async createPost(
    userId,
    title,
    description,
    carBrand,
    carMotor,
    carFirstRegistration,
    carModel,
    carType,
    categoryId
  ) {
    try {
      const query = `
        INSERT INTO post (user_id, title, description, car_brand, car_motor, car_first_registration, car_model, car_type, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [
        userId,
        title,
        description,
        carBrand,
        carMotor,
        carFirstRegistration,
        carModel,
        carType,
        categoryId,
      ]);
      const insertedId = result.insertId;
      const newPost = await this.getPostById(insertedId);
      return newPost;
    } catch (error) {
      console.error("Error in createPost:", error);
      throw error;
    }
  }

  async removeImages(postId) {
    try {
      const query = `
        DELETE FROM post_image WHERE post_id = ?
      `;
      await db.query(query, [postId]);
    } catch (error) {
      console.error("Error in removeImages:", error);
      throw error;
    }
  }

  async saveImage(filename, postId) {
    try {
      const query = `
        INSERT INTO post_image (image, post_id)
        VALUES (?, ?)
      `;
      await db.query(query, [filename, postId]);
    } catch (error) {
      console.error("Error in createPost:", error);
      throw error;
    }
  }

  async updatePost(
    postId,
    title,
    description,
    carBrand,
    carMotor,
    carFirstRegistration,
    carModel,
    carType,
    categoryId
  ) {
    try {
      const query = `
        UPDATE post
        SET title = ?, description = ?, car_brand = ?, car_motor = ?, car_first_registration = ?, car_model = ?, car_type = ?, category_id = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [
        title,
        description,
        carBrand,
        carMotor,
        carFirstRegistration,
        carModel,
        carType,
        categoryId,
        postId,
      ]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedPost = await this.getPostById(postId);
      return updatedPost;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }

  async removeUser(userId) {
    try {
      const query = `
        UPDATE post
        SET user_id = null WHERE user_id = ?
      `;
      const [result] = await db.query(query, [userId]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedPost = await this.getPostById(userId);
      return updatedPost;
    } catch (error) {
      console.error("Error in removeUser:", error);
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
      console.error("Error in deletepost:", error);
      throw error;
    }
  }
}

module.exports = new PostModel();
