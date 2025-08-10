import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handler() {
	try {
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
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		}
	}
}
