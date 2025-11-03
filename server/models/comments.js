const { supabase } = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const commentsModel = {
  // Create tables via Supabase Dashboard SQL Editor
  createTable: async () => {
    console.log('✅ Comments table managed via Supabase Dashboard');
    return true;
  },

  createUsersTable: async () => {
    console.log('✅ Users table managed via Supabase Dashboard');
    return true;
  },

  // Add a new comment
  addComment: async (projectId, name, email, comment, parentId = null) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            project_id: projectId,
            name,
            email,
            comment,
            parent_id: parentId,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      return { success: true, id: data[0].id, comment: data[0] };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all comments for a project
  getCommentsByProject: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('project_id', projectId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, comments: data };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Get replies for a comment
  getReplies: async (commentId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', commentId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { success: true, replies: data };
    } catch (error) {
      console.error('Error getting replies:', error);
      return { success: false, error: error.message };
    }
  },

  // Get comments by user email
  getCommentsByUser: async (email) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, comments: data };
    } catch (error) {
      console.error('Error getting user comments:', error);
      return { success: false, error: error.message };
    }
  },

  // Register a new user
  registerUser: async (email, password, name) => {
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            name,
            created_at: new Date().toISOString()
          }
        ])
        .select('id, email, name');

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'Email already registered' };
        }
        throw error;
      }

      return { success: true, id: data[0].id, user: data[0] };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, password')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { success: false, user: null };
      }

      const match = await bcrypt.compare(password, data.password);
      
      if (match) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.id);

        return {
          success: true,
          user: {
            id: data.id,
            email: data.email,
            name: data.name
          }
        };
      }

      return { success: false, user: null };
    } catch (error) {
      console.error('Error logging in user:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = commentsModel;