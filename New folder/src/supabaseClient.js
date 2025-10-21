import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jdwbdrfxpmagokacwwpj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd2JkcmZ4cG1hZ29rYWN3d3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjQ2NzksImV4cCI6MjA3Mzg0MDY3OX0.8LlSnqNBRHotvcErNTei8_ttLINDMxLmkhvhQXmtlSo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
