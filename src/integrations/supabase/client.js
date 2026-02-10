// Supabase Client for vanilla JavaScript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://oweyqxzyjctenaonxfkl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZXlxeHp5amN0ZW5hb254ZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTQyNDUsImV4cCI6MjA4NjIzMDI0NX0.wNJaQfwk3mFzahX1GrPLVjEh4E-7fcANAH17uWcCS9o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
