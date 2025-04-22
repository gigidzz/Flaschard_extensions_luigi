import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

//load enviorment variables
dotenv.config();

//check if we have variable sthat we need
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

//create supabase client with my supabase url and service key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
);