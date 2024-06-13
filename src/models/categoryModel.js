const db = require("../utils/db");

class CategoryModel {
    async getAllCategories() {
        const query = `
            SELECT *
            FROM category
        `;
        return await db.queryDatabase(query);
    }
}

module.exports = new CategoryModel();
