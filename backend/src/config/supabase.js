import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jbtygeofamxmgthhvkwv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidHlnZW9mYW14bWd0aGh2a3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNjcxMTcsImV4cCI6MjA5Mjg0MzExN30.rW_OjaO21qMAYc0YJFssT4UgXdmTUBarbfQiiIRVZCI";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;