const db = require('../utils/db');
const auth = require('../utils/auth');

class UserModel {
  async getAllUsers() {
    try {
      const query = `
        SELECT *
        FROM users
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const query = `
        SELECT *
        FROM users
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  async getImage(userId) {
    try {
      const query = `
        SELECT profile_image
        FROM users
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getImage:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const query = `
        SELECT *
        FROM users
        WHERE email = ?
      `;
      const [rows] = await db.query(query, [email]);
      return rows[0];
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      throw error;
    }
  }

  async isEmailTakenByOtherUser(id, email) {
    try {
      const query = `
        SELECT *
        FROM users
        WHERE email = ?
        AND id != ?
      `;
      const [rows] = await db.query(query, [email, id]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error in isEmailTakenByOtherUser:', error);
      throw error;
    }
  }

  async createUser(name, email, hash, description, filename) {
    try {
      const query = `
        INSERT INTO users (name, email, password, description, profile_image, role_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [name, email, hash, description, filename, auth.DEFAULT_ROLE_ID]);
      const insertedId = result.insertId;
      const newUser = await this.getUserById(insertedId);
      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async updateUser(userId, name, email, description, filename) {
    try {
      const query = `
        UPDATE users
        SET name = ?, email = ?, description = ?, profile_image = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [name, email, description, filename, userId]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedUser = await this.getUserById(userId);
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async newPassword(userId, newPasswordHash) {
    try {
      const query = `
        UPDATE users
        SET password = ? WHERE id = ?
      `;
      await db.query(query, [newPasswordHash, userId]);
    } catch (error) {
      console.error('Error in newPassword:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const query = `
        DELETE FROM users WHERE id = ?
      `;
      const [result] = await db.query(query, [userId]);
      if (result.affectedRows === 0) {
        return null;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}

module.exports = new UserModel();
