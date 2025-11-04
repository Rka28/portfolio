// server/models/comments.js
const { supabase } = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const commentsModel = {
  // 🔹 Ces fonctions ne créent plus de tables (Supabase les gère)
  createTable: async () => {
    console.log('✅ Comments table managed via Supabase Dashboard');
    return true;
  },

  createUsersTable: async () => {
    console.log('✅ Users table managed via Supabase Dashboard');
    return true;
  },

  // 🔹 Ajouter un commentaire
  addComment: async (projectId, name, email, comment, parentId = null) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ project_id: projectId, name, email, comment, parent_id: parentId }])
        .select();

      if (error) throw error;
      return { success: true, id: data[0].id };
    } catch (error) {
      console.error('❌ Error adding comment:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔹 Récupérer tous les commentaires d’un projet
  getCommentsByProject: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('project_id', projectId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ajouter le nombre de réponses à chaque commentaire
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', comment.id);
          return { ...comment, reply_count: count || 0 };
        })
      );

      return { success: true, comments: commentsWithReplies };
    } catch (error) {
      console.error('❌ Error fetching comments:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔹 Récupérer les réponses à un commentaire
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
      console.error('❌ Error fetching replies:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔹 Récupérer les commentaires d’un utilisateur
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
      console.error('❌ Error fetching user comments:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔹 Inscription d’un utilisateur
  registerUser: async (email, password, name) => {
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, name }])
        .select();

      if (error) throw error;
      return { success: true, id: data[0].id };
    } catch (error) {
      console.error('❌ Error registering user:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔹 Connexion d’un utilisateur
  loginUser: async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!data) return { success: false, message: 'Utilisateur non trouvé' };

      const match = await bcrypt.compare(password, data.password);
      if (!match) return { success: false, message: 'Mot de passe incorrect' };

      // Mise à jour du dernier login
      await supabase
        .from('users')
        .update({ last_login: new Date() })
        .eq('id', data.id);

      return {
        success: true,
        user: { id: data.id, name: data.name, email: data.email }
      };
    } catch (error) {
      console.error('❌ Error logging in user:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = commentsModel;
