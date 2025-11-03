const { supabase } = require('../config/db');

const subscribersModel = {
  createTable: async () => {
    console.log('✅ Subscribers table managed via Supabase Dashboard');
    return true;
  },

  // Add a new subscriber
  addSubscriber: async (email) => {
    try {
      // Vérifier si l'email existe déjà
      const { data: existing, error: checkError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', email)
        .single();

      // Si l'email existe, réactiver l'abonnement
      if (existing) {
        const { data, error } = await supabase
          .from('subscribers')
          .update({ is_active: true })
          .eq('email', email)
          .select();

        if (error) throw error;
        return { success: true, id: data[0].id, subscriber: data[0] };
      }

      // Sinon, créer un nouveau subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ])
        .select();

      if (error) throw error;

      return { success: true, id: data[0].id, subscriber: data[0] };
    } catch (error) {
      console.error('Error adding subscriber:', error);
      return { success: false, error: error.message };
    }
  },

  // Unsubscribe a subscriber
  unsubscribe: async (email) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .update({ is_active: false })
        .eq('email', email)
        .select();

      if (error) throw error;

      return { success: true, affected: data.length };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all active subscribers
  getAllActive: async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;

      return { success: true, subscribers: data };
    } catch (error) {
      console.error('Error getting subscribers:', error);
      return { success: false, error: error.message };
    }
  },

  // Update last_email_sent timestamp
  updateLastEmailSent: async (email) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .update({ last_email_sent: new Date().toISOString() })
        .eq('email', email)
        .select();

      if (error) throw error;

      return { success: true, affected: data.length };
    } catch (error) {
      console.error('Error updating last email sent:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = subscribersModel;