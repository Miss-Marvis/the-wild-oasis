/* eslint-disable no-unused-vars */
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useRecentBookings from './useRecentBookings'
import Spinner from '../../ui/Spinner'
import useRecentStays from './useRecentStays'

import { useCabins } from '../cabins/useCabins'
import {
	HiOutlineBriefcase,
	HiOutlineBanknotes,
	HiOutlineCalendarDays,
	HiOutlineChartBar,
} from 'react-icons/hi2'
import Stat from './Stat'
import { formatCurrency } from '../../utils/helpers'

const StyledDashboardLayout = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: auto 34rem auto;
	gap: 2.4rem;
`

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
	// Provide safe defaults
	const safeBookings = bookings || []
	const safeConfirmedStays = confirmedStays || []

	// Calculate statistics
	const numBookings = safeBookings.length
	const sales = safeBookings.reduce((acc, cur) => {
		return acc + (cur.totalPrice || 0)
	}, 0)
	const checkins = safeConfirmedStays.length

	// Calculate occupancy rate
	const occupation =
		cabinCount && numDays
			? Math.round((checkins / (cabinCount * numDays)) * 100)
			: 0

	console.log('📊 Calculated stats:', {
		numBookings,
		sales,
		checkins,
		occupation,
	})

	return (
		<>
			<Stat
				title='Bookings'
				color='blue'
				icon={<HiOutlineBriefcase />}
				value={numBookings}
			/>
			<Stat
				title='Sales'
				color='green'
				icon={<HiOutlineBanknotes />}
				value={formatCurrency(sales)}
			/>
			<Stat
				title='Check ins'
				color='indigo'
				icon={<HiOutlineCalendarDays />}
				value={checkins}
			/>
			<Stat
				title='Occupancy rate'
				color='yellow'
				icon={<HiOutlineChartBar />}
				value={`${occupation}%`}
			/>
		</>
	)
}

// PropTypes validation
Stats.propTypes = {
	bookings: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			totalPrice: PropTypes.number,
			// Add other booking properties as needed
			created_at: PropTypes.string,
			startDate: PropTypes.string,
			endDate: PropTypes.string,
			numNights: PropTypes.number,
			numGuests: PropTypes.number,
			status: PropTypes.string,
		})
	),
	confirmedStays: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			// Add other confirmed stay properties as needed
			startDate: PropTypes.string,
			endDate: PropTypes.string,
			status: PropTypes.string,
		})
	),
	numDays: PropTypes.number.isRequired,
	cabinCount: PropTypes.number.isRequired,
}

// Default props (optional but recommended)
Stats.defaultProps = {
	bookings: [],
	confirmedStays: [],
}

export default Stats
