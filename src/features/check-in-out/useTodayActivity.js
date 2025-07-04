import { useQuery } from '@tanstack/react-query'
import { getTodayActivity } from '../../services/apiBookings'

export function useTodayActivity() {
	const { isLoading, data: activities } = useQuery({
		queryFn: getTodayActivity,
		queryKey: ['today-activity'],
	})
	return { activities, isLoading }
}

export default useTodayActivity
