const db = require("../utils/db");

class CarModel {
    async getAllCars() {
        const query = `
            SELECT *
            FROM car
        `;
        return await db.queryDatabase(query);
    }

    async getCarById(carId) {
        const query = `
            SELECT *
            FROM car
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [carId]);
        return rows[0];
    }

    async getAllCarsByUserId(userId) {
        const query = `
            SELECT *
            FROM car
            WHERE user_id = ?
        `;
        return await db.queryDatabase(query, [userId]);
    }

    async getImage(carId) {
        const query = `
            SELECT image
            FROM car
            WHERE id = ?;
        `;
        const rows = await db.queryDatabase(query, [carId]);
        return rows[0];
    }

  async getCarById(carId) {
      const query = `
        SELECT *
        FROM car
        WHERE id = ?
      `;
      const rows = await db.queryDatabase(query, [carId]);
      return rows[0];
  }

    async isUserOwnerOfCar(userId, carId) {
        const query = `
            SELECT *
            FROM car 
            WHERE user_id = ? AND id = ?
        `;
        const rows = await db.queryDatabase(query, [userId, carId]);
        return rows.length > 0;
    }

    async createCar(userId, brand, motor, firstRegistration, model, type, licensePlate, vin, filename) {
        const query = `
            INSERT INTO car (user_id, brand, motor, first_registration, model, type, license_plate, vin, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.queryDatabase(query, [userId, brand, motor, firstRegistration, model, type, licensePlate, vin, filename]);
        const insertedId = result.insertId;
        const newCar = await this.getCarById(insertedId);
        return newCar;
    }

    async updateCar(carId, brand, motor, firstRegistration, model, type, licensePlate, vin, filename) {
        const query = `
            UPDATE car
            SET brand = ?, motor = ?, first_registration = ?, model = ?, type = ?, license_plate = ?, vin = ?, image = ?
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [brand, motor, firstRegistration, model, type, licensePlate, vin, filename, carId]);
        if (result.affectedRows === 0) {
            return null;
        }
        const updatedCar = await this.getCarById(carId);
        return updatedCar;
    }

    async deleteCar(carId) {
        const query = `
            DELETE FROM car
            WHERE id = ?
        `;
        const result = await db.queryDatabase(query, [carId]);
        if (result.affectedRows === 0) {
            return null;
        }
        return true;
    }
}

module.exports = new CarModel();
