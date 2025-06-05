// 📦 Use everything from the standard 'date-fns'
import { formatDistance, parseISO, differenceInDays } from 'date-fns'

// ✅ getToday: returns start or end of today as ISO string
export const getToday = function (options = {}) {
	const today = new Date()

	if (options?.end) today.setUTCHours(23, 59, 59, 999)
	else today.setUTCHours(0, 0, 0, 0)

	return today.toISOString()
}

// ✅ formatCurrency: formats a number to USD currency
export const formatCurrency = (value) =>
	new Intl.NumberFormat('en', {
		style: 'currency',
		currency: 'USD',
	}).format(value)

// ✅ subtractDates: returns the difference in days between 2 dates
export const subtractDates = (dateStr1, dateStr2) =>
	differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)))

// ✅ formatDistanceFromNow: returns "x days ago" or "In x days"
export const formatDistanceFromNow = (dateStr) =>
	formatDistance(parseISO(dateStr), new Date(), {
		addSuffix: true,
	})
		.replace('about ', '')
		.replace('in ', 'In ')
