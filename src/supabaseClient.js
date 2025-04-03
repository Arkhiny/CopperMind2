// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'postgresql://postgres:[5FYFPgLP858rEXHY]@db.zwxczvbftepnxsykbzud.supabase.co:5432/postgres'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGN6dmJmdGVwbnhzeWtienVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mjg0OTQsImV4cCI6MjA1OTIwNDQ5NH0.k7F19dl_Fl_4emO85CAiTW5a2GMhu3u1Hr-ooSAFGPo'; // Replace with your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
