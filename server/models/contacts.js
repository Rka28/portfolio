const { pool } = require('../config/db');

// Contacts model for storing contact form submissions
const contactsModel = {
  // Create the contacts table if it doesn't exist
  createTable: async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE
        )
      `);
      console.log('✅ Contacts table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating contacts table:', error);
      return false;
    }
  },

  // Add a new contact form submission
  addContact: async (name, email, message) => {
    try {
      const result = await pool.query(
        'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
        [name, email, message]
      );
      return { success: true, id: result.rows[0].id, contact: result.rows[0] };
    } catch (error) {
      console.error('Error adding contact:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all contact form submissions
  getAll: async () => {
    try {
      const result = await pool.query(
        'SELECT * FROM contacts ORDER BY created_at DESC'
      );
      return { success: true, contacts: result.rows };
    } catch (error) {
      console.error('Error getting contacts:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark a contact form submission as read
  markAsRead: async (id) => {
    try {
      const result = await pool.query(
        'UPDATE contacts SET is_read = TRUE WHERE id = $1',
        [id]
      );
      return { success: true, affected: result.rowCount };
    } catch (error) {
      console.error('Error marking contact as read:', error);
      return { success: false, error: error.message };
    }
  },

  // Get unread contact form submissions count
  getUnreadCount: async () => {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE'
      );
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = contactsModel;