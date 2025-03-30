import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log('Initializing Supabase with:', {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseKey,
    url: supabaseUrl
});

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
supabase.auth.getSession().then(response => {
    console.log('Supabase connection test:', response);
}).catch(error => {
    console.error('Supabase connection error:', error);
});
