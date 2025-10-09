const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

// Comments model for project comments
const commentsModel = {
  // Create the comments table if it doesn't exist
  createTable: async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          project_id VARCHAR(10) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          comment TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE,
          parent_id INTEGER NULL,
          FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Comments table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating comments table:', error);
      return false;
    }
  },

  // Create the users table if it doesn't exist
  createUsersTable: async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL
        )
      `);
      console.log('✅ Users table created or already exists');
      return true;
    } catch (error) {
      console.error('Error creating users table:', error);
      return false;
    }
  },

  // Add a new comment
  addComment: async (projectId, name, email, comment, parentId = null) => {
    try {
      const result = await pool.query(
        'INSERT INTO comments (project_id, name, email, comment, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [projectId, name, email, comment, parentId]
      );
      return { success: true, id: result.rows[0].id, comment: result.rows[0] };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all comments for a project
  getCommentsByProject: async (projectId) => {
    try {
      const result = await pool.query(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count 
         FROM comments c 
         WHERE c.project_id = $1 AND c.parent_id IS NULL 
         ORDER BY c.created_at DESC`,
        [projectId]
      );
      return { success: true, comments: result.rows };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Get replies for a comment
  getReplies: async (commentId) => {
    try {
      const result = await pool.query(
        'SELECT * FROM comments WHERE parent_id = $1 ORDER BY created_at ASC',
        [commentId]
      );
      return { success: true, replies: result.rows };
    } catch (error) {
      console.error('Error getting replies:', error);
      return { success: false, error: error.message };
    }
  },

  // Get comments by user email
  getCommentsByUser: async (email) => {
    try {
      const result = await pool.query(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count 
         FROM comments c 
         WHERE c.email = $1 
         ORDER BY c.created_at DESC`,
        [email]
      );
      return { success: true, comments: result.rows };
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
      
      const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
      );
      return { success: true, id: result.rows[0].id, user: result.rows[0] };
    } catch (error) {
      // PostgreSQL error code for unique violation
      if (error.code === '23505') {
        return { success: false, error: 'Email already registered' };
      }
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      // First, get the user by email to retrieve the hashed password
      const result = await pool.query(
        'SELECT id, email, name, password FROM users WHERE email = $1',
        [email]
      );
      
      let success = false;
      let user = null;
      
      // If user exists, compare the provided password with the stored hash
      if (result.rows.length > 0) {
        const match = await bcrypt.compare(password, result.rows[0].password);
        
        if (match) {
          success = true;
          user = {
            id: result.rows[0].id,
            email: result.rows[0].email,
            name: result.rows[0].name
          };
          
          // Update last login timestamp
          await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [result.rows[0].id]
          );
        }
      }
      
      return { success, user };
    } catch (error) {
      console.error('Error logging in user:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = commentsModel;