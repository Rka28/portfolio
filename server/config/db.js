const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 60000 // Augmenter le timeout à 60 secondes
  });

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
