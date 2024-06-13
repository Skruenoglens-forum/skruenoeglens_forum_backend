const mysql = require("mysql2");
const { config } = require("./config");

// Validate required configuration properties
const requiredConfigProperties = [
    "DB_HOST",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_PORT",
];
const missingProps = requiredConfigProperties.filter((prop) => !config[prop]);

if (missingProps.length > 0) {
    console.error(`Missing required configuration properties: ${missingProps.join(", ")}`);
    process.exit(1); // Exit the process if any required property is missing
}

const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: config.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        process.exit(1); // Exit the process if the connection fails
    }
    console.log(`Connected to MySQL database at ${config.DB_HOST}:${config.DB_PORT}`);
    connection.release();
});

// Function to query the database asynchronously
const queryDatabase = async (query, params = []) => {
    try {
        const [rows] = await pool.promise().query(query, params);
        return rows;
    } catch (error) {
        console.error(`Database query error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    pool: pool,
    queryDatabase: queryDatabase,
};

