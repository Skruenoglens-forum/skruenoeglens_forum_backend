const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const auth = require("../utils/auth");
const path = require("path");
const fs = require("fs");

class UserController {
  async getAll(req, res) {
    try {
      const users = await userModel.getAllUsers();

      users.forEach((u) => {
        delete u.password;
      });
      res.json(users);
    } catch (error) {
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
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getImageById(req, res) {
    const userId = req.params.id;

    try {
      const image = await userModel.getImage(userId);

      const imagePath = path.join(
        __dirname,
        `../../uploads/${image.profile_image}`
      );

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(200)
            .sendFile(path.join(__dirname, `../../uploads/default/user.png`));
        }

        res.status(200).sendFile(imagePath);
      });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    const { name, email, password, description } = req.body;

    let filename = "default/user.png";

    if (req.file) {
      filename = req.file.filename;
    }

    try {
      // CHECK IF USER EXISTS
      const user = await userModel.getUserByEmail(email);
      if (user) {
        return res.status(404).json({ error: "Email er taget" });
      }

      // SAVE USER
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await userModel.createUser(
        name,
        email,
        hash,
        description,
        filename
      );

      delete newUser.password;
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
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
      // TODO: DELETE OLD PROFILE IMAGE

      const decoded = auth.verifyToken(token);
      if (
        !decoded ||
        (decoded.uid != userId && decoded.roleId !== auth.ADMIN_ROLE_ID)
      ) {
        return res
          .status(403)
          .json({ error: "Du må ikke opdatere andre brugere" });
      }

      const user = await userModel.getUserById(userId);

      // Delete the file
      if (!user.profile_image.includes("default")) {
        fs.unlink(`./uploads/${user.profile_image}`, () => {});
      }

      const emailIsTaken = await userModel.isEmailTakenByOtherUser(
        userId,
        email
      );
      if (emailIsTaken) {
        return res
          .status(400)
          .json({ error: "Email er taget af en anden bruger" });
      }

      const updatedUser = await userModel.updateUser(
        userId,
        name,
        email,
        description,
        filename
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "Kunne ikke finde bruger" });
      }

      delete updatedUser.password;
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async ban(req, res) {
    const userId = req.params.id;

    try {
      const bannedUser = await userModel.banUser(userId);
      if (!bannedUser) {
        return res.status(404).json({ error: "Kunne ikke finde bruger" });
      }

      delete bannedUser.password;
      res.json(bannedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unban(req, res) {
    const userId = req.params.id;

    try {
      const unbannedUser = await userModel.unbanUser(userId);
      if (!unbannedUser) {
        return res.status(404).json({ error: "Kunne ikke finde bruger" });
      }

      delete unbannedUser.password;
      res.json(unbannedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    const userId = req.params.id;
    const token = req.header("Authorization");

    try {
      const decoded = auth.verifyToken(token);

      if (
        !decoded ||
        (decoded.roleId == auth.DEFAULT_ROLE_ID && decoded.uid != userId)
      ) {
        return res
          .status(403)
          .json({ error: "Du må ikke slette andre brugere" });
      }

      const user = await userModel.getUserById(userId);

      // Delete the file
      if (!user.profile_image.includes("default")) {
        fs.unlink(`./uploads/${user.profile_image}`, () => {});
      }

      const deletedUser = await userModel.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "Kunne ikke finde bruger" });
      }

      delete deletedUser.password;
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new UserController();
