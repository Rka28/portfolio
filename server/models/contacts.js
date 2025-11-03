const { supabase } = require('../config/db');

const contactsModel = {
  createTable: async () => {
    console.log('✅ Contacts table managed via Supabase Dashboard');
    return true;
  },

  addContact: async (name, email, message) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name,
            email,
            message,
            created_at: new Date().toISOString(),
            is_read: false
          }
        ])
        .select();

      if (error) throw error;

      return { success: true, id: data[0].id, contact: data[0] };
    } catch (error) {
      console.error('Error adding contact:', error);
      return { success: false, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, contacts: data };
    } catch (error) {
      console.error('Error getting contacts:', error);
      return { success: false, error: error.message };
    }
  },

  markAsRead: async (id) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      return { success: true, affected: 1 };
    } catch (error) {
      console.error('Error marking contact as read:', error);
      return { success: false, error: error.message };
    }
  },

  getUnreadCount: async () => {
    try {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = contactsModel;