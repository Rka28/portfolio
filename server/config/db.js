const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Supabase connection established successfully');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
  }
};

module.exports = { supabase, testConnection };