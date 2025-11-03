require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('projects').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Connecté à Supabase avec succès !');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion à Supabase :', err.message);
    return false;
  }
};

module.exports = { supabase, testConnection };
