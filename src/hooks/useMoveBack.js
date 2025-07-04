// Create: src/hooks/useMoveBack.js

import { useNavigate } from 'react-router-dom'

export function useMoveBack() {
	const navigate = useNavigate()

	return () => navigate(-1) // Goes back one step in browser history
}
