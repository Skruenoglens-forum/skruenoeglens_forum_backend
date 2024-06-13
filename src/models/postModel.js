const db = require("../utils/db");

class PostModel {
    async getAllPosts(sql, queryVars) {
        const query = `
            SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name, IFNULL(comment_counts.comment_count, 0) AS comment_count, GROUP_CONCAT(post_image.id) AS image_ids
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
        return await db.queryDatabase(query, queryVars)
    }

    async getPostById(postId) {
        const query = `
            SELECT post.*, users.name AS user_name, users.id AS user_id, category.name AS category_name, IFNULL(comment_counts.comment_count, 0) AS comment_count, GROUP_CONCAT(post_image.id) AS image_ids
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
        const rows = await db.queryDatabase(query, [postId]);
        return rows[0];
    }

    async getAllPostsByUserId(userId) {
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
        return await db.queryDatabase(query, [userId]);
    }

    async getAllImagesByPostId(postId) {
        const query = `
            SELECT *
            FROM post_image
            WHERE post_id = ?
        `;
        return await db.queryDatabase(query, [postId]);
    }

    async getImage(postImageId) {
        const query = `
            SELECT image
            FROM post_image
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [postImageId]);
        return rows[0];
    }

    async isUserOwnerOfPost(userId, postId) {
        const query = `
            SELECT *
            FROM post 
            WHERE user_id = ? AND id = ?
        `;
        const rows = await db.queryDatabase(query, [userId, postId]);
        return rows.length > 0;
    }

    async createPost(userId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId) {
        const query = `
            INSERT INTO post (user_id, title, description, car_brand, car_motor, car_first_registration, car_model, car_type, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.queryDatabase(query, [userId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId]);
        const insertedId = result.insertId;
        const newPost = await this.getPostById(insertedId);
        return newPost;
    }

    async removeImages(postId) {
        const query = `
            DELETE
            FROM post_image
            WHERE post_id = ?
        `;
        await db.queryDatabase(query, [postId]);
    }

    async saveImage(filename, postId) {
        const query = `
            INSERT INTO post_image (image, post_id)
            VALUES (?, ?)
        `;
        await db.queryDatabase(query, [filename, postId]);
    }

    async updatePost(postId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId) {
        const query = `
            UPDATE post
            SET title = ?, description = ?, car_brand = ?, car_motor = ?, car_first_registration = ?, car_model = ?, car_type = ?, category_id = ?
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId, postId]);
        if (result.affectedRows === 0) {
            return null;
        }

        const updatedPost = await this.getPostById(postId);
        return updatedPost;
    }

    async removeUser(userId) {
        const query = `
            UPDATE post
            SET user_id = null
            WHERE user_id = ?
        `;
        const result = await db.queryDatabase(query, [userId]);
        if (result.affectedRows === 0) {
            return null;
        }
        const updatedPost = await this.getPostById(userId);
        return updatedPost;
    }

    async deletePost(postId) {
        const query = `
            DELETE
            FROM post
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [postId]);
        if (result.affectedRows === 0) {
        return null;
        }
        return true;
    }
}

module.exports = new PostModel();
