const carModel = require("../models/carModel");
const auth = require("../utils/auth");
const path = require("path");
const fs = require("fs");

class CarController {
    async getAll(req, res) {
        try {
            const cars = await carModel.getAllCars();
            res.json(cars);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getById(req, res) {
        const carId = req.params.id;

        try {
            const car = await carModel.getCarById(carId);
            if (!car) {
                return res.status(404).json({ error: "Kunne ikke finde bil" });
            }

            res.json(car);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAllByUserId(req, res) {
        const userId = req.params.id;

        try {
            const cars = await carModel.getAllCarsByUserId(userId);
            res.json(cars);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getImageById(req, res) {
        const carId = req.params.id;

        try {
            const image = await carModel.getImage(carId);

            if (!image) {
                return res.status(404).json({ error: "Bilelde ikke fundet" });
            }

            const imagePath = path.join(__dirname, `../../uploads/${image.image}`);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(200).sendFile(path.join(__dirname, `../../uploads/default/car.png`));
            }

            res.status(200).sendFile(imagePath);
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async create(req, res) {
        const token = req.header("Authorization");
        const { brand, motor, firstRegistration, model, type, licensePlate, vin } = req.body;
        let filename = "default/car.png";

        if (req.file) {
            filename = req.file.filename;
        }

        try {
            const decoded = auth.verifyToken(token);
            const newCar = await carModel.createCar(decoded.uid, brand, motor, firstRegistration, model, type, licensePlate, vin, filename);
            res.status(201).json(newCar);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async update(req, res) {
        const carId = req.params.id;
        const { brand, motor, firstRegistration, model, type, licensePlate, vin } = req.body;
        const token = req.header("Authorization");
        let filename = "default/car.png";

        if (req.file) {
            filename = req.file.filename;
        }

        try {
            const decoded = auth.verifyToken(token);
            const isUserOwnerOfCar = await carModel.isUserOwnerOfCar(decoded.uid, carId);
            if (!isUserOwnerOfCar && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(400).json({ error: "Dette er ikke din bil" });
            }

            const car = await carModel.getCarById(carId);
            if (!car.image.includes("default")) {
                fs.unlink(`./uploads/${car.image}`, () => {});
            }

            const updatedCar = await carModel.updateCar(carId, brand, motor, firstRegistration, model, type, licensePlate, vin, filename);
            if (!updatedCar) {
                return res.status(404).json({ error: "Kunne ikke finde bil" });
            }

            res.json(updatedCar);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async delete(req, res) {
        const carId = req.params.id;
        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);

            const isUserOwnerOfCar = await carModel.isUserOwnerOfCar(decoded.uid, carId);
            if (!isUserOwnerOfCar && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(400).json({ error: "Dette er ikke din bil" });
            }

            const car = await carModel.getCarById(carId);

            if (!car.image.includes("default")) {
                fs.unlink(`./uploads/${car.image}`, () => {});
            }

            const deletedCar = await carModel.deleteCar(carId);
            if (!deletedCar) {
                return res.status(404).json({ error: "Kunne ikke finde bil" });
            }

            res.json({ message: "Car deleted successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new CarController();
