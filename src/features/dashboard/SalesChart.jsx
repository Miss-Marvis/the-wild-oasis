/* eslint-disable no-mixed-spaces-and-tabs */
import styled from 'styled-components'
import PropTypes from 'prop-types'
import DashboardBox from './DashboardBox'
import Heading from '../../ui/Heading'
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import {
	format,
	startOfMonth,
	endOfMonth,
	eachMonthOfInterval,
	isSameMonth,
} from 'date-fns'
import { useDarkMode } from '../../context/DarkModeContext'

const StyledSalesChart = styled(DashboardBox)`
	grid-column: 1 / -1;

	/* Hack to change grid line colors */
	& .recharts-cartesian-grid-horizontal line,
	& .recharts-cartesian-grid-vertical line {
		stroke: var(--color-grey-300);
	}
`

const CHART_CONFIG = {
	height: 300,
	strokeWidth: 2,
	fillOpacity: 0.4,
	strokeDasharray: '4',
}

const THEME_COLORS = {
	dark: {
		totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
		extraSales: { stroke: '#22c55e', fill: '#22c55e' },
		text: '#e5e7eb',
		background: '#1f2937',
		border: '#374151',
	},
	light: {
		totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
		extraSales: { stroke: '#16a34a', fill: '#dcfce7' },
		text: '#374151',
		background: '#fff',
		border: '#d1d5db',
	},
}

function SalesChart({ bookings = [] }) {
	const { isDarkMode } = useDarkMode()

	// Generate date range - expand to show more months
	const endDate = new Date()

	const chartStartDate = new Date(endDate.getFullYear(), 0, 1)
	const chartEndDate = new Date(endDate.getFullYear(), 11, 31)

	// Then update the month interval to:
	const allMonths = eachMonthOfInterval({
		start: startOfMonth(chartStartDate),
		end: endOfMonth(chartEndDate),
	})

	// Process data for chart - group by months
	const data = allMonths.map((month) => {
		const monthBookings = bookings.filter((booking) =>
			isSameMonth(month, new Date(booking.created_at))
		)

		return {
			label: format(month, 'MMM yyyy'),
			totalSales: monthBookings.reduce(
				(acc, cur) => acc + (cur.totalPrice || 0),
				0
			),
			extraSales: monthBookings.reduce(
				(acc, cur) => acc + (cur.extrasPrice || 0),
				0
			),
		}
	})

	// Theme colors
	const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light

	// Format date range for heading
	const dateRange = `${format(chartStartDate, 'MMM yyyy')} — ${format(
		endDate,
		'MMM yyyy'
	)}`

	return (
		<StyledSalesChart>
			<Heading as='h2'>Sales from {dateRange}</Heading>

			<ResponsiveContainer height={CHART_CONFIG.height} width='100%'>
				<AreaChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<XAxis
						dataKey='label'
						tick={{ fill: colors.text, fontSize: 12 }}
						tickLine={{ stroke: colors.text }}
						axisLine={{ stroke: colors.text }}
					/>

					<YAxis
						unit='$'
						tick={{ fill: colors.text, fontSize: 12 }}
						tickLine={{ stroke: colors.text }}
						axisLine={{ stroke: colors.text }}
					/>

					<CartesianGrid strokeDasharray={CHART_CONFIG.strokeDasharray} />

					<Tooltip
						contentStyle={{
							backgroundColor: colors.background,
							border: `1px solid ${colors.border}`,
							borderRadius: '8px',
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
						}}
						labelStyle={{ color: colors.text, fontWeight: 'bold' }}
						itemStyle={{ color: colors.text }}
					/>

					<Area
						dataKey='totalSales'
						type='monotone'
						stroke={colors.totalSales.stroke}
						fill={colors.totalSales.fill}
						fillOpacity={CHART_CONFIG.fillOpacity}
						strokeWidth={CHART_CONFIG.strokeWidth}
						name='Total sales'
						unit='$'
					/>

					<Area
						dataKey='extraSales'
						type='monotone'
						stroke={colors.extraSales.stroke}
						fill={colors.extraSales.fill}
						fillOpacity={CHART_CONFIG.fillOpacity}
						strokeWidth={CHART_CONFIG.strokeWidth}
						name='Extras sales'
						unit='$'
					/>
				</AreaChart>
			</ResponsiveContainer>
		</StyledSalesChart>
	)
}

// PropTypes validation
SalesChart.propTypes = {
	bookings: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			created_at: PropTypes.string.isRequired,
			totalPrice: PropTypes.number,
			extrasPrice: PropTypes.number,
		})
	),
	numDays: PropTypes.number,
}

export default SalesChart
