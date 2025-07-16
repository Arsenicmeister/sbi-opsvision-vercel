import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jixeqatzhrsqrbmdcvyk.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
