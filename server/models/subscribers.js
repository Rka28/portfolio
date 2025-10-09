const { pool } = require('../config/db');

// Subscribers model for newsletter subscriptions
const subscribersModel = {
  // Create the subscribers table if it doesn't exist
  createTable: async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          last_email_sent TIMESTAMP NULL
        )
      `);
      console.log('✅ Subscribers table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating subscribers table:', error);
      return false;
    }
  },

  // Add a new subscriber
  addSubscriber: async (email) => {
    try {
      const result = await pool.query(
        `INSERT INTO subscribers (email) 
         VALUES ($1) 
         ON CONFLICT (email) 
         DO UPDATE SET is_active = TRUE
         RETURNING *`,
        [email]
      );
      return { success: true, id: result.rows[0].id, subscriber: result.rows[0] };
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return { success: false, error: error.message };
    }
  },

  // Unsubscribe a subscriber (set is_active to false)
  unsubscribe: async (email) => {
    try {
      const result = await pool.query(
        'UPDATE subscribers SET is_active = FALSE WHERE email = $1',
        [email]
      );
      return { success: true, affected: result.rowCount };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all active subscribers
  getAllActive: async () => {
    try {
      const result = await pool.query(
        'SELECT * FROM subscribers WHERE is_active = TRUE ORDER BY subscribed_at DESC'
      );
      return { success: true, subscribers: result.rows };
    } catch (error) {
      console.error('Error getting subscribers:', error);
      return { success: false, error: error.message };
    }
  },

  // Update last_email_sent timestamp for a subscriber
  updateLastEmailSent: async (email) => {
    try {
      const result = await pool.query(
        'UPDATE subscribers SET last_email_sent = CURRENT_TIMESTAMP WHERE email = $1',
        [email]
      );
      return { success: true, affected: result.rowCount };
    } catch (error) {
      console.error('Error updating last email sent:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = subscribersModel;