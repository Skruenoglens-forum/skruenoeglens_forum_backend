const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { config } = require("./utils/config");
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const basePath = "/api/v1";
const APP_PORT = config.APP_PORT;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // create application/x-www-form-urlencoded parser
app.use(bodyParser.json());

// Routes
app.use(`${basePath}/users`, userRoutes);
app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/cars`, carRoutes);
app.use(`${basePath}/posts`, postRoutes);
app.use(`${basePath}/comments`, commentRoutes);
app.use(`${basePath}/categories`, categoryRoutes);

// Server
app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}, basePath: ${basePath}`);
});
