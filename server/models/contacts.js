const { pool } = require('../config/db');

// Contacts model for storing contact form submissions
const contactsModel = {
  // Create the contacts table if it doesn't exist
  createTable: async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE
        )
      `);
      connection.release();
      console.log('Contacts table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating contacts table:', error);
      return false;
    }
  },

  // Add a new contact form submission
  addContact: async (name, email, message) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
        [name, email, message]
      );
      connection.release();
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Error adding contact:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all contact form submissions
  getAll: async () => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT * FROM contacts ORDER BY created_at DESC'
      );
      connection.release();
      return { success: true, contacts: rows };
    } catch (error) {
      console.error('Error getting contacts:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark a contact form submission as read
  markAsRead: async (id) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE contacts SET is_read = TRUE WHERE id = ?',
        [id]
      );
      connection.release();
      return { success: true, affected: result.affectedRows };
    } catch (error) {
      console.error('Error marking contact as read:', error);
      return { success: false, error: error.message };
    }
  },

  // Get unread contact form submissions count
  getUnreadCount: async () => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE'
      );
      connection.release();
      return { success: true, count: rows[0].count };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = contactsModel;
