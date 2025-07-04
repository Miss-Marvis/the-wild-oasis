import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../../services/apiAuth'

export function useLogin() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const { mutate: login, isLoading } = useMutation({
		mutationFn: ({ email, password }) => {
			return loginApi({ email, password })
		},
		onSuccess: (user) => {
			queryClient.setQueryData(['user'], user.user)
			navigate('/dashboard', { replace: true })
			toast.success('Successfully logged in!')
		},
		onError: (err) => {
			console.log('Login ERROR:', err)
			toast.error('Provided email or password are incorrect')
		},
	})

	return { login, isLoading }
}
