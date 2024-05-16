const carModel = require('../models/carModel');
const auth = require('../utils/auth');

class CarController {
  async getAll(req, res) {
    try {
      const cars = await carModel.getAllCars();

      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    const carId = req.params.id;

    try {
      const car = await carModel.getCarById(carId);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      res.json(car);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    const { user_id, brand, model, motor, type, year, license_plate, vin, first_registration } = req.body;

    try {
      const newCar = await carModel.createCar(user_id, brand, model, motor, type, year, license_plate, vin, first_registration);

      res.status(201).json(newCar);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    const carId = req.params.id;
    const { brand, model, motor, type, year, license_plate, vin, first_registration } = req.body;
    const token = req.header("Authorization");

    try {
      const decoded = auth.verifyToken(token);

      const isUserOwnerOfCar = await carModel.isUserOwnerOfCar(decoded.uid, carId);
      if (!isUserOwnerOfCar && decoded.role_id !== auth.ADMIN_ROLE_ID) {
        return res.status(400).json({ error: 'This is not your car' });
      }

      const updatedCar = await carModel.updateCar(carId, brand, model, motor, type, year, license_plate, vin, first_registration);
      if (!updatedCar) {
        return res.status(404).json({ error: 'Car not found' });
      }

      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    const carId = req.params.id;
    const token = req.header("Authorization");

    try {
      const decoded = auth.verifyToken(token);

      const isUserOwnerOfCar = await carModel.isUserOwnerOfCar(decoded.uid, carId);
      if (!isUserOwnerOfCar && decoded.role_id !== auth.ADMIN_ROLE_ID) {
        return res.status(400).json({ error: 'This is not your car' });
      }

      const deletedCar = await carModel.deleteCar(carId);
      if (!deletedCar) {
        return res.status(404).json({ error: 'Car not found' });
      }

      res.json({ message: 'Car deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CarController();
