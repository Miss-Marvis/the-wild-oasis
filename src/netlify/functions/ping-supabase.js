import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL // Match what's in Netlify
const supabaseKey = process.env.SUPABASE_ANON_KEY // This one matches
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handler() {
	try {
		// Add some logging to debug
		console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
		console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing')

		// Harmless query to keep DB active
		const { data, error } = await supabase
			.from('bookings')
			.select('id')
			.limit(1)

		if (error) throw error

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Ping successful', data }),
		}
	} catch (err) {
		console.error('Function error:', err)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		}
	}
}
