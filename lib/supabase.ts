import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dpctunptgwovyjurqwnn.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY as string;
export const supabase = createClient(supabaseKey, supabaseUrl);
