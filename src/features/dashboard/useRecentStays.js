import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { useSearchParams } from 'react-router-dom'
import { getStaysAfterDate } from '../../services/apiBookings'

export default function useRecentStays() {
	const [searchParams] = useSearchParams()
	const numDays = !searchParams.get('last')
		? 7
		: Number(searchParams.get('last'))
	const queryDate = subDays(new Date(), numDays).toISOString()

	const { isLoading, data: stays } = useQuery({
		queryFn: () => getStaysAfterDate(queryDate),
		queryKey: ['stays', `last-${numDays}`],
		staleTime: 1000 * 60 * 5,
	})

	// Safe defaults and filtering
	const safeStays = stays || []
	const confirmedStays = safeStays.filter(
		(stay) => stay.status === 'checked-in' || stay.status === 'checked-out'
	)

	return {
		isLoading,
		stays: safeStays,
		confirmedStays,
		numDays,
	}
}
