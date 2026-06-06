import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  // Get any candidate
  const { data: candidates, error: fetchErr } = await supabase.from('candidates').select('id, email_sent').limit(1);
  
  if (fetchErr || !candidates || candidates.length === 0) {
    console.error("Fetch failed or no candidates:", fetchErr);
    return;
  }
  
  const targetId = candidates[0].id;
  console.log(`Trying to update candidate ${targetId}...`);
  
  const { data, error } = await supabase.from('candidates').update({ email_sent: true }).eq('id', targetId).select();
  
  if (error) {
    console.error("UPDATE ERROR:", error);
  } else {
    console.log("UPDATE SUCCESS:", data);
  }
}

testUpdate();
