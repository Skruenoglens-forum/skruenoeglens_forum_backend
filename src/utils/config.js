require("dotenv").config();

// APP_PORT is not required, it defaults to port 8080
const requiredEnvVars = [
    "DB_HOST",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_PORT",
    "JWT_SECRET_KEY",
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing or empty value for required environment variable: ${envVar}`);
        process.exit(1); // Exit the process with an error code
    }
}

const loadConfig = () => {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`Missing or empty value for required environment variable: ${envVar}`);
            process.exit(1);
        }
    }

    return {
        APP_PORT: process.env.APP_PORT || 8080,
        DB_HOST: process.env.DB_HOST,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    };
};

const config = loadConfig();

module.exports = { config };
