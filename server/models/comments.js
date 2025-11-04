const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

// Comments model for project comments
const commentsModel = {
  // Create the comments table if it doesn't exist
  createTable: async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id VARCHAR(10) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          comment TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE,
          parent_id INT NULL,
          FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
        )
      `);
      connection.release();
      console.log('Comments table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating comments table:', error);
      return false;
    }
  },

  // Create the users table if it doesn't exist
  createUsersTable: async () => {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL
        )
      `);
      connection.release();
      console.log('Users table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating users table:', error);
      return false;
    }
  },

  // Add a new comment
  addComment: async (projectId, name, email, comment, parentId = null) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO comments (project_id, name, email, comment, parent_id) VALUES (?, ?, ?, ?, ?)',
        [projectId, name, email, comment, parentId]
      );
      connection.release();
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all comments for a project
  getCommentsByProject: async (projectId) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count 
         FROM comments c 
         WHERE c.project_id = ? AND c.parent_id IS NULL 
         ORDER BY c.created_at DESC`,
        [projectId]
      );
      connection.release();
      return { success: true, comments: rows };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Get replies for a comment
  getReplies: async (commentId) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT * FROM comments WHERE parent_id = ? ORDER BY created_at ASC',
        [commentId]
      );
      connection.release();
      return { success: true, replies: rows };
    } catch (error) {
      console.error('Error getting replies:', error);
      return { success: false, error: error.message };
    }
  },

  // Get comments by user email
  getCommentsByUser: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count 
         FROM comments c 
         WHERE c.email = ? 
         ORDER BY c.created_at DESC`,
        [email]
      );
      connection.release();
      return { success: true, comments: rows };
    } catch (error) {
      console.error('Error getting user comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Register a new user
  registerUser: async (email, password, name) => {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      );
      connection.release();
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      const connection = await pool.getConnection();
      
      // First, get the user by email to retrieve the hashed password
      const [rows] = await connection.query(
        'SELECT id, email, name, password FROM users WHERE email = ?',
        [email]
      );
      
      let success = false;
      let user = null;
      
      // If user exists, compare the provided password with the stored hash
      if (rows.length > 0) {
        const match = await bcrypt.compare(password, rows[0].password);
        
        if (match) {
          success = true;
          user = {
            id: rows[0].id,
            email: rows[0].email,
            name: rows[0].name
          };
          
          // Update last login timestamp
          await connection.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [rows[0].id]
          );
        }
      }
      
      connection.release();
      return { success, user };
    } catch (error) {
      console.error('Error logging in user:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = commentsModel;
