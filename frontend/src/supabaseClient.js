import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jixeqatzhrsqrbmdcvyk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeGVxYXR6aHJzcXJibWRjdnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODQ4NTQsImV4cCI6MjA2ODE2MDg1NH0.4mTKl9L3hyv40FolCnDDyEc1fdywuQMkWFKjXs4gWYA";

export const supabase = createClient(supabaseUrl, supabaseKey);
