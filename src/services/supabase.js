import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://xzzfowkmjdjyfhcauhwg.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6emZvd2ttamRqeWZoY2F1aHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Njc3OTEsImV4cCI6MjA2NDM0Mzc5MX0.mJQwVJtpCP2YIXT6dwg8YW0jxFRaA7M98DxxhCGgvbc'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
