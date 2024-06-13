const auth = require("../utils/auth");

class AuthMiddleware {
    roleCheck(roleCheck) {
        return function(req, res, next) {
            const token = req.header("Authorization");
    
            if (!token) {
                return res.status(401).json({ message: "Authentication token is required." });
            }
    
            const tokenParts = token.split(" ");
            if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
                return res.status(401).json({ message: "Invalid token format." });
            }
    
            const decoded = auth.verifyToken(token);
            if (!decoded) {
                return res.status(404).json({ message: "You do not have permission." });
            }
    
            if (roleCheck && decoded.roleId !== auth.ADMIN_ROLE_ID) {
                return res.status(404).json({ message: "You do not have permission." });
            }
    
            next();
        };
    }
}

module.exports = new AuthMiddleware();
