const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { config } = require("../utils/config");
const auth = require("../utils/auth");

class UserController {
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await userModel.getUserByEmail(email);

            if (!user) {
                return res.status(404).json({ error: "Kunne ikke finde bruger" });
            }

            if (user.role_id == auth.USER_BAN_ID) {
                return res.status(403).json({ error: "Du er banned" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(404).json({ error: "Forkert password" });
            }


            let jwtSecretKey = config.JWT_SECRET_KEY;
            let data = {
                email: user.email,
                uid: user.id,
                roleId: user.role_id,
            };

            const token = jwt.sign(data, jwtSecretKey, { expiresIn: "60min" });

            return res.json({ token });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async newPassword(req, res) {
        const userId = req.params.id;
        const { newPassword } = req.body;
        const token = req.header("Authorization");

        try {
            var decoded = auth.verifyToken(token);

            if (!decoded || (decoded.uid != userId && decoded.roleId !== auth.ADMIN_ROLE_ID)) {
                return res.status(403).json({ error: "Du har ikke tilladelse til at opdatere andre brugere" });
            }

            const newPasswordHash = bcrypt.hashSync(newPassword, 10);

            await userModel.newPassword(userId, newPasswordHash);

            return res.json({ message: "Successfull" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new UserController();
