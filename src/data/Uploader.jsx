import { useState } from 'react'
import { isFuture, isPast, isToday, parseISO } from 'date-fns'
import supabase from '../services/supabase'
import Button from '../ui/Button'
import { subtractDates } from '../utils/helpers'

import bookings from '../data/data-booking'
import cabins from '../data/data-cabins'
import guests from '../data/data-guests'

const originalSettings = {
	minBookingLength: 3,
	maxBookingLength: 30,
	maxGuestsPerBooking: 10,
	breakfastPrice: 15,
}

function calculateBookingStatus(startDate, endDate) {
	try {
		// Parse dates properly
		const start =
			typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate)
		const end =
			typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate)

		// Check if dates are valid
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			console.error('Invalid dates:', { startDate, endDate })
			return 'unconfirmed'
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

		// If booking has ended (past end date)
		if (isPast(end) && !isToday(end)) {
			return 'checked-out'
		}

		// If booking hasn't started yet (future start date)
		if (isFuture(start) || isToday(start)) {
			return 'unconfirmed'
		}

		// If booking is currently active (started but not ended)
		if ((isPast(start) || isToday(start)) && (isFuture(end) || isToday(end))) {
			return 'checked-in'
		}

		// Default fallback
		return 'unconfirmed'
	} catch (error) {
		console.error('Error calculating status:', error)
		return 'unconfirmed'
	}
}

async function deleteGuests() {
	const { error } = await supabase.from('guests').delete().gt('id', 0)
	if (error) console.log(error.message)
}

async function deleteCabins() {
	const { error } = await supabase.from('cabins').delete().gt('id', 0)
	if (error) console.log(error.message)
}

async function deleteBookings() {
	const { error } = await supabase.from('bookings').delete().gt('id', 0)
	if (error) console.log(error.message)
}

async function createGuests() {
	const { error } = await supabase.from('guests').insert(guests)
	if (error) console.log(error.message)
}

async function createCabins() {
	const { error } = await supabase.from('cabins').insert(cabins)
	if (error) console.log(error.message)
}

async function createBookings() {
	// Get actual IDs from database
	const { data: guestsIds } = await supabase
		.from('guests')
		.select('id')
		.order('id')
	const allGuestIds = guestsIds.map((guest) => guest.id)

	const { data: cabinsIds } = await supabase
		.from('cabins')
		.select('id')
		.order('id')
	const allCabinIds = cabinsIds.map((cabin) => cabin.id)

	const finalBookings = bookings
		.map((booking, index) => {
			console.log(`\n--- Processing booking ${index + 1} ---`)

			// Validate cabin exists
			const cabinIndex = booking.cabinId - 1
			if (cabinIndex >= cabins.length || cabinIndex < 0) {
				console.error(
					` Cabin with ID ${
						booking.cabinId
					} not found (index: ${cabinIndex}, max: ${cabins.length - 1})`
				)
				return null
			}

			const cabin = cabins[cabinIndex]
			if (!cabin) {
				return null
			}

			// Validate guest exists
			const guestIndex = booking.guestId - 1
			if (guestIndex >= allGuestIds.length || guestIndex < 0) {
				console.error(
					` Guest with ID ${
						booking.guestId
					} not found (index: ${guestIndex}, max: ${allGuestIds.length - 1})`
				)
				return null
			}

			const dbCabinId = allCabinIds[cabinIndex]
			const dbGuestId = allGuestIds[guestIndex]

			if (!dbCabinId || !dbGuestId) {
				console.error(
					`Missing database IDs - Cabin: ${dbCabinId}, Guest: ${dbGuestId}`
				)
				return null
			}

			// Calculate pricing
			const numNights = subtractDates(booking.endDate, booking.startDate)
			const cabinPrice = numNights * (cabin.regularPrice - cabin.discount)
			const extrasPrice = booking.hasBreakfast
				? numNights * originalSettings.breakfastPrice * booking.numGuests
				: 0
			const totalPrice = cabinPrice + extrasPrice

			// Calculate status using the helper function
			const status = calculateBookingStatus(booking.startDate, booking.endDate)

			return {
				...booking,
				numNights,
				cabinPrice,
				extrasPrice,
				totalPrice,
				guestId: dbGuestId,
				cabinId: dbCabinId,
				status, // Make sure this is a clean string
			}
		})
		.filter((booking) => booking !== null)

	if (finalBookings.length === 0) {
		return
	}

	// Insert bookings
	const { error } = await supabase.from('bookings').insert(finalBookings)
	if (error) {
		console.error(' Supabase insert error:', error.message)
	}
}

function Uploader() {
	const [isLoading, setIsLoading] = useState(false)

	async function uploadAll() {
		setIsLoading(true)
		try {
			await deleteBookings()
			await deleteGuests()
			await deleteCabins()

			await createGuests()
			await createCabins()
			await createBookings()
		} catch (error) {
			console.error(' Upload failed:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function uploadBookings() {
		setIsLoading(true)
		try {
			await deleteBookings()
			await createBookings()
		} catch (error) {
			console.error(' Bookings upload failed:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div
			style={{
				marginTop: 'auto',
				backgroundColor: '#e0e7ff',
				padding: '8px',
				borderRadius: '5px',
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
			}}
		>
			<h3>SAMPLE DATA</h3>

			<Button onClick={uploadAll} disabled={isLoading}>
				{isLoading ? 'Uploading...' : 'Upload ALL'}
			</Button>

			<Button onClick={uploadBookings} disabled={isLoading}>
				{isLoading ? 'Uploading...' : 'Upload bookings ONLY'}
			</Button>
		</div>
	)
}

export default Uploader
