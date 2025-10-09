const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 30000,
  max: 10
});

const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL connection established successfully');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL database:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

module.exports = { pool, testConnection };