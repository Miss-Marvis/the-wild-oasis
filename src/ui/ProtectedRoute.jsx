// import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useUser } from '../features/authentication/useUser'
import Spinner from './Spinner'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const FullPage = styled.div`
height: 100vh;
background-color: var(--color-grey-50)
display: flex;
align-items: center;
justify-content: center;
`

export default function ProtectedRoute({ children }) {
	const navigate = useNavigate()
	const { isLoading, isAuthenticated } = useUser()

	useEffect(
		function () {
			if (!isAuthenticated && !isLoading) navigate('/login')
		},
		[isAuthenticated, isLoading, navigate]
	)

	if (isLoading)
		return (
			<FullPage>
				<Spinner />
			</FullPage>
		)

	if (isAuthenticated) return children
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
}
