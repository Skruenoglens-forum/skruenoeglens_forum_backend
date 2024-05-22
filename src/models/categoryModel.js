const db = require('../utils/db');

class CategoryModel {
  async getAllCategories() {
    try {
      const query = `
        SELECT *
        FROM category
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  }
}

module.exports = new CategoryModel();
