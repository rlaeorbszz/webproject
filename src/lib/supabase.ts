import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddnhjoiklhzcttsvlcmd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbmhqb2lrbGh6Y3R0c3ZsY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTA3MjQsImV4cCI6MjA2MzI4NjcyNH0.ntwfZmNh7Y8YCqL9I3Qh3gW9BbLlQwHXmVwYsW3CsHs';

export const supabase = createClient(supabaseUrl, supabaseKey);
