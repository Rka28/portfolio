const { pool } = require('../config/db');

// Subscribers model for newsletter subscriptions
const subscribersModel = {
  // Create the subscribers table if it doesn't exist
  createTable: async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          last_email_sent TIMESTAMP NULL
        )
      `);
      connection.release();
      console.log('Subscribers table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating subscribers table:', error);
      return false;
    }
  },

  // Add a new subscriber
  addSubscriber: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE is_active = TRUE',
        [email]
      );
      connection.release();
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return { success: false, error: error.message };
    }
  },

  // Unsubscribe a subscriber (set is_active to false)
  unsubscribe: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE subscribers SET is_active = FALSE WHERE email = ?',
        [email]
      );
      connection.release();
      return { success: true, affected: result.affectedRows };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all active subscribers
  getAllActive: async () => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT * FROM subscribers WHERE is_active = TRUE'
      );
      connection.release();
      return { success: true, subscribers: rows };
    } catch (error) {
      console.error('Error getting subscribers:', error);
      return { success: false, error: error.message };
    }
  },

  // Update last_email_sent timestamp for a subscriber
  updateLastEmailSent: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE subscribers SET last_email_sent = CURRENT_TIMESTAMP WHERE email = ?',
        [email]
      );
      connection.release();
      return { success: true, affected: result.affectedRows };
    } catch (error) {
      console.error('Error updating last email sent:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = subscribersModel;
