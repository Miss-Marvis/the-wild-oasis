import { PAGE_SIZE } from '../utils/constants'
// import { getToday } from '../utils/helpers'
import supabase from './supabase'

export async function getBookings({ filter, sortBy, page }) {
	let query = supabase.from('bookings').select(
		`
      *,
      guests!inner (
        id,
        fullName,
        email
      ),
      cabins!inner (
        id,
        name,
        image
      )
    `,
		{ count: 'exact' }
	)
	// FILTER
	if (filter) {
		query = query[filter.method || 'eq'](filter.field, filter.value)
	}
	// SORT
	if (sortBy) {
		query = query.order(sortBy.field, {
			ascending: sortBy.direction === 'asc',
		})
	}
	// PAGINATION - Fixed the syntax and calculation
	if (page) {
		const from = (page - 1) * PAGE_SIZE
		const to = from + PAGE_SIZE - 1 // This was the main issue
		query = query.range(from, to)
	}
	const { data, error, count } = await query
	if (error) {
		console.error('Supabase error:', error)
		throw new Error('Bookings could not be loaded')
	}
	return { data, count }
}

export async function getBooking(id) {
	const { data, error } = await supabase
		.from('bookings')
		.select('*, cabins(*), guests(*)')
		.eq('id', id)
		.single()
	if (error) {
		console.error(error)
		throw new Error('Booking not found')
	}
	return data
}

// NEW: Update booking function for check-in/check-out
export async function updateBooking(id, obj) {
	const { data, error } = await supabase
		.from('bookings')
		.update(obj)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		console.error(error)
		throw new Error('Booking could not be updated')
	}
	return data
}

export async function deleteBooking(id) {
	const { data, error } = await supabase.from('bookings').delete().eq('id', id)

	if (error) {
		console.error(error)
		throw new Error('Booking could not be deleted')
	}
	return data
}

// Returns all BOOKINGS that are were created after the given date.
// Useful to get bookings created-on the last 30 days, for example.
export async function getBookingsAfterDate(date) {
	try {
		const { data, error } = await supabase
			.from('bookings')
			.select('created_at, totalPrice, extrasPrice')
			.gte('created_at', date)

		if (error) {
			throw new Error(`Bookings could not get loaded: ${error.message}`)
		}

		return data || []
	} catch (err) {
		console.error(err)
		throw err
	}
}

// Returns all STAYS that are were created after the given date
// Fixed version - use created_at instead of startDate
// Modified version of getStaysAfterDate that can handle today's activities
export async function getStaysAfterDate(date, getTodayActivities = false) {
	try {
		let dateString
		if (!date) {
			dateString = new Date().toISOString()
		} else if (typeof date === 'string') {
			dateString = new Date(date).toISOString()
		} else if (date instanceof Date) {
			dateString = date.toISOString()
		} else {
			dateString = new Date().toISOString()
		}

		let query = supabase
			.from('bookings')
			.select(
				'*, guests(fullName, email, nationalID, nationality, countryFlag), cabins(name)'
			)

		if (getTodayActivities) {
			// For today's activities, we need arrivals and departures for today
			const todayString = new Date().toISOString().split('T')[0]
			query = query
				.or(`startDate.gte.${todayString},endDate.gte.${todayString}`)
				.or(
					`startDate.lt.${todayString}T23:59:59,endDate.lt.${todayString}T23:59:59`
				)
				.in('status', ['unconfirmed', 'checked-in'])
		} else {
			// Original logic for stays after date
			query = query
				.gte('startDate', dateString)
				.lte('startDate', new Date().toISOString())
				.in('status', ['unconfirmed', 'checked-in'])
		}

		const { data, error } = await query.order('startDate')

		if (error) {
			console.error(error)
			throw new Error(`Stays could not get loaded: ${error.message}`)
		}

		let result = data || []

		// If getting today's activities, filter and add activity types
		if (getTodayActivities) {
			const todayString = new Date().toISOString().split('T')[0]
			const todayDate = new Date(todayString)

			result = result
				.filter((booking) => {
					const startDate = new Date(booking.startDate)
					const endDate = new Date(booking.endDate)
					const startsToday =
						startDate.toDateString() === todayDate.toDateString()
					const endsToday = endDate.toDateString() === todayDate.toDateString()
					return startsToday || endsToday
				})
				.map((booking) => {
					const startDate = new Date(booking.startDate)
					const endDate = new Date(booking.endDate)
					const startsToday =
						startDate.toDateString() === todayDate.toDateString()
					const endsToday = endDate.toDateString() === todayDate.toDateString()

					let activityType = ''
					if (startsToday && endsToday) {
						activityType = 'arriving-departing'
					} else if (startsToday) {
						activityType = 'arriving'
					} else if (endsToday) {
						activityType = 'departing'
					}

					return {
						...booking,
						activityType,
						guests: {
							...booking.guests,
							country: booking.guests.nationality,
						},
					}
				})
		}

		return result
	} catch (err) {
		console.error(err)
		throw err
	}
}

export async function getTodayActivity() {
	try {
		const today = new Date()
		const todayString = today.toISOString().split('T')[0] // '2025-06-24'

		// Get bookings for today - arrivals and departures
		const { data, error } = await supabase
			.from('bookings')
			.select(
				`
        *,
        guests(fullName, email, nationalID, nationality, countryFlag),
        cabins(name)
      `
			)
			.or(`startDate.gte.${todayString},endDate.gte.${todayString}`)
			.or(
				`startDate.lt.${todayString}T23:59:59,endDate.lt.${todayString}T23:59:59`
			)
			.order('startDate')

		if (error) {
			throw new Error(
				`Today's activities could not be loaded: ${error.message}`
			)
		}

		// Filter for today's activities in JavaScript for more precise control
		const todayActivities =
			data?.filter((booking) => {
				const startDate = new Date(booking.startDate)
				const endDate = new Date(booking.endDate)
				const todayDate = new Date(todayString)

				// Check if booking starts today or ends today
				const startsToday =
					startDate.toDateString() === todayDate.toDateString()
				const endsToday = endDate.toDateString() === todayDate.toDateString()

				return startsToday || endsToday
			}) || []

		// Add activity type to each booking
		const activitiesWithType = todayActivities.map((booking) => {
			const startDate = new Date(booking.startDate)
			const endDate = new Date(booking.endDate)
			const todayDate = new Date(todayString)

			const startsToday = startDate.toDateString() === todayDate.toDateString()
			const endsToday = endDate.toDateString() === todayDate.toDateString()

			let activityType = ''
			if (startsToday && endsToday) {
				activityType = 'arriving-departing'
			} else if (startsToday) {
				activityType = 'arriving'
			} else if (endsToday) {
				activityType = 'departing'
			}

			return {
				...booking,
				activityType,
				// Map nationality to country for consistency
				guests: {
					...booking.guests,
					country: booking.guests.nationality,
				},
			}
		})

		return activitiesWithType
	} catch (err) {
		console.error(err)
		throw err
	}
}
