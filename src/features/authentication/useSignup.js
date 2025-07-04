import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { signup as signupApi } from '../../services/apiAuth'

export function useSignup() {
	const { mutate: signup, isLoading } = useMutation({
		mutationFn: signupApi,
		onSuccess: (user) => {
			console.log('Signup success:', user)
			toast.success(
				"Account successfully created! please verify the new account from the user's email address."
			)
		},
		onError: (err) => {
			console.log('Signup ERROR:', err)
			toast.error('There was an error creating the account')
		},
	})
	return { signup, isLoading }
}
