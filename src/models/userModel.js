const db = require("../utils/db");
const auth = require("../utils/auth");

class UserModel {
    async getAllUsers() {
        const query = `
            SELECT users.*, user_role.name AS role_name
            FROM users
            JOIN user_role ON users.role_id = user_role.id;
        `;
        return await db.queryDatabase(query);
    }

    async getUserById(userId) {
        const query = `
            SELECT *
            FROM users
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [userId]);
        return rows[0];
    }

    async getImage(userId) {
        const query = `
            SELECT profile_image
            FROM users
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [userId]);
        return rows[0];
    }

    async getUserByEmail(email) {
        const query = `
            SELECT *
            FROM users
            WHERE email = ?;
        `;
        const rows = await db.queryDatabase(query, [email]);
        return rows[0];
    }

    async isEmailTakenByOtherUser(id, email) {
        const query = `
            SELECT *
            FROM users
            WHERE email = ? AND id != ?;
        `;
        const rows = await db.queryDatabase(query, [email, id]);
        return rows.length > 0;
    }

    async createUser(name, email, hash, description, filename) {
        const query = `
            INSERT INTO users (name, email, password, description, profile_image, role_id)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const result = await db.queryDatabase(query, [name, email, hash, description, filename, auth.DEFAULT_ROLE_ID]);
        return await this.getUserById(result.insertId);
    }

    async updateUser(userId, name, email, description, filename) {
        const query = `
            UPDATE users SET name = ?, email = ?, description = ?, profile_image = ?
            WHERE id = ?;
        `;
        const result = await db.queryDatabase(query, [name, email, description, filename, userId]);
        if (result.affectedRows === 0) {
            return null;
        }
        return await this.getUserById(userId);
    }

    async changeUserRole(userId, roleId) {
        const query = `
            UPDATE users SET role_id = ?
            WHERE id = ?;
        `;
        const result = await db.queryDatabase(query, [roleId, userId]);
        if (result.affectedRows === 0) {
            return null;
        }
        return await this.getUserById(userId);
    }

    async banUser(userId) {
        return await this.changeUserRole(userId, 3);
    }

    async unbanUser(userId) {
        return await this.changeUserRole(userId, 2);
    }

    async newPassword(userId, newPasswordHash) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE id = ?;
        `;
        await db.queryDatabase(query, [newPasswordHash, userId]);
    }

    async deleteUser(userId) {
        const query = `
            DELETE FROM users
            WHERE id = ?;
        `;
        await db.queryDatabase(query, [userId]);
    }
}

module.exports = new UserModel();
