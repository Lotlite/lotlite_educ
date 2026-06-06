import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../frontend/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testColumn() {
  const { data, error } = await supabase.from('candidates').select('email_sent').limit(1);
  if (error) {
    console.error("Column check failed:", error.message);
  } else {
    console.log("Column check passed:", data);
  }
}

testColumn();
