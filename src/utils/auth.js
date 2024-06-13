const jwt = require("jsonwebtoken");
const { config } = require("./config");

const USER_BAN_ID = 3;
const DEFAULT_ROLE_ID = 2;
const ADMIN_ROLE_ID = 1;

function verifyToken(token) {
    try {
        return jwt.verify(token.split(" ")[1], config.JWT_SECRET_KEY);
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

module.exports = {
    verifyToken,
    DEFAULT_ROLE_ID,
    ADMIN_ROLE_ID,
    USER_BAN_ID,
};
