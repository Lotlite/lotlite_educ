import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pelbzgpgbmtzahxfnanc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbGJ6Z3BnYm10emFoeGZuYW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTg3ODIsImV4cCI6MjA5NDMzNDc4Mn0.ZKKds8IAdytSPCIxf_zApupNueojCA5g1unjhyQJ08o';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: (...args) => fetch(...args) }
});

async function run() {
  const { data: candidates } = await supabase.from('candidates').select('id, email_sent').limit(1);
  if (!candidates || candidates.length === 0) {
    console.log("No candidates found");
    return;
  }
  const id = candidates[0].id;
  console.log(`Updating candidate ${id}...`);
  
  const { data, error, count } = await supabase.from('candidates')
    .update({ email_sent: true })
    .eq('id', id)
    .select('*'); // Use select to see if it actually updated and returned rows
    
  console.log("Error:", error);
  console.log("Data returned (affected rows):", data?.length);
}

run();
