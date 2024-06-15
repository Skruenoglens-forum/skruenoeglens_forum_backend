const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const auth = require("../utils/auth");

class UserController {
    async getAll(req, res) {
        try {
            const users = await userModel.getAllUsers();
            users.forEach((u) => {delete u.password});
            res.json(users);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getById(req, res) {
        const userId = req.params.id;
        try {
            const user = await userModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Kunne ikke finde bruger" });
            }
            delete user.password;
            res.json(user);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getImageById(req, res) {
        const userId = req.params.id;
        try {
            const image = await userModel.getImage(userId);
            const imagePath = path.join(__dirname,`../../uploads/${image.profile_image}`);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(200).sendFile(path.join(__dirname, "../../uploads/default/user.png"));
                }
                res.sendFile(imagePath);
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async create(req, res) {
        const { name, email, password, description } = req.body;

        if (password.length < 7) {
            return res.status(404).json({ error: "Password skal mindst indeholde 7 karaktere" });
        }

        let filename = "default/user.png";
        if (req.file) {
            filename = req.file.filename;
        }

        try {
            const user = await userModel.getUserByEmail(email);
            if (user) {
                return res.status(404).json({ error: "Email er taget" });
            }

            const hash = bcrypt.hashSync(password, 10);
            const newUser = await userModel.createUser(name, email, hash, description, filename);

            delete newUser.password;
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async update(req, res) {
        const userId = req.params.id;
        const { name, email, description } = req.body;
        let filename = "default/user.png";

        if (req.file) {
            filename = req.file.filename;
        }

        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);
            if (!decoded || (decoded.uid != userId && decoded.roleId !== auth.ADMIN_ROLE_ID)) {
                return res.status(403).json({ error: "Du må ikke opdatere andre brugere" });
            }

            const user = await userModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Bruger ikke fundet" });
            }

            if (!user.profile_image.includes("default")) {
                fs.unlink(`./uploads/${user.profile_image}`, () => {});
            }

            const emailIsTaken = await userModel.isEmailTakenByOtherUser(userId, email);
            if (emailIsTaken) {
                return res.status(400).json({ error: "Email er taget af en anden bruger" });
            }

            const updatedUser = await userModel.updateUser(userId, name, email, description, filename);
            if (!updatedUser) {
                return res.status(404).json({ error: "Kunne ikke finde bruger" });
            }

            delete updatedUser.password;
            res.json(updatedUser);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async banOrUnban(req, res, isBan) {
        const userId = req.params.id;
        try {
            const updatedUser = isBan ? await userModel.banUser(userId) : await userModel.unbanUser(userId);
            if (!updatedUser) {
                return res.status(404).json({ error: "Kunne ikke finde bruger" });
            }
            delete updatedUser.password;
            res.json(updatedUser);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async ban(req, res) {
        await this.banOrUnban(req, res, true);
    }

    async unban(req, res) {
        await this.banOrUnban(req, res, false);
    }

    async delete(req, res) {
        const userId = req.params.id;
        const token = req.header("Authorization");

        try {
            const decoded = auth.verifyToken(token);
            if (!decoded || (decoded.roleId == auth.DEFAULT_ROLE_ID && decoded.uid != userId)) {
                return res.status(403).json({ error: "Du må ikke slette andre brugere" })
            }

            const user = await userModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Bruger ikke fundet" });
            }

            if (!user.profile_image.includes("default")) {
                fs.unlink(`./uploads/${user.profile_image}`, () => {});
            }

            await postModel.removeUser(userId);
            await commentModel.removeUser(userId);

            await userModel.deleteUser(userId);

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new UserController();
