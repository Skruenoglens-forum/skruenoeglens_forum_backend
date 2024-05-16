const db = require('../utils/db');

class CarModel {
  async getAllCars() {
    try {
      const query = `
        SELECT *
        FROM car
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error in getAllCars:', error);
      throw error;
    }
  }

  async getCarById(carId) {
    try {
      const query = `
        SELECT *
        FROM car
        WHERE id = ?;
      `;
      const [rows] = await db.query(query, [carId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getCarById:', error);
      throw error;
    }
  }

  async getCarById(carId) {
    try {
      const query = `
        SELECT *
        FROM car
        WHERE id = ?
      `;
      const [rows] = await db.query(query, [carId]);
      return rows[0];
    } catch (error) {
      console.error('Error in getCarById:', error);
      throw error;
    }
  }

  async isUserOwnerOfCar(userId, carId) {
    try {
      const query = `
        SELECT * FROM car 
        WHERE userId = ? AND id = ?
      `;
      const [rows] = await db.query(query, [userId, carId]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error in isUserOwnerOfCar:', error);
      throw error;
    }
  }

  async createCar(userId, brand, motor, firstRegistration, model, type, licensePlate, vin) {
    try {
      const query = `
        INSERT INTO car (userId, brand, motor, firstRegistration, model, type, licensePlate, vin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [userId, brand, motor, firstRegistration, model, type, licensePlate, vin]);
      const insertedId = result.insertId;
      const newCar = await this.getCarById(insertedId);
      return newCar;
    } catch (error) {
      console.error('Error in createCar:', error);
      throw error;
    }
  }

  async updateCar(carId, brand, motor, firstRegistration, model, type, licensePlate, vin) {
    try {
      const query = `
        UPDATE car
        SET brand = ?, motor = ?, firstRegistration = ?, model = ?, type = ?, licensePlate = ?, vin = ? WHERE id = ?
      `;
      const [result] = await db.query(query, [brand, motor, firstRegistration, model, type, licensePlate, vin, carId]);
      if (result.affectedRows === 0) {
        return null;
      }
      const updatedCar = await this.getCarById(carId);
      return updatedCar;
    } catch (error) {
      console.error('Error in updateCar:', error);
      throw error;
    }
  }

  async deleteCar(carId) {
    try {
      const query = `
        DELETE FROM car WHERE id = ?
      `;
      const [result] = await db.query(query, [carId]);
      if (result.affectedRows === 0) {
        return null;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteCar:', error);
      throw error;
    }
  }
}

module.exports = new CarModel();
