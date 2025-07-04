import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateCurrentUser } from '../../services/apiAuth'

export function useUpdateUser() {
	const queryClient = useQueryClient()

	const { mutate: updateUser, isLoading: isUpdating } = useMutation({
		mutationFn: updateCurrentUser,
		onSuccess: ({ user }) => {
			toast.success('User account successfully updated')

			// ✅ Fix: Set the actual user data in cache
			queryClient.setQueryData(['user'], user)

			// ✅ Fix: Invalidate queries correctly
			queryClient.invalidateQueries({ queryKey: ['user'] })
		},
		onError: (err) => toast.error(err.message),
	})

	return { updateUser, isUpdating }
}
