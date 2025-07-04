// import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledErrorFallback = styled.main`
	height: 100vh;
	background-color: var(--color-grey-50);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4.8rem;
`

const Box = styled.div`
	background-color: var(--color-grey-0);
	border: 1px solid var(--color-grey-100);
	border-radius: var(--border-radius-md);
	padding: 4.8rem;
	flex: 0 1 96rem;
	text-align: center;

	& h1 {
		margin-bottom: 1.6rem;
	}
`

function ErrorFallback({ error }) {
	return (
		<StyledErrorFallback>
			<Box>
				<h1>Something went wrong 🧐</h1>
				<p>{error.message}</p>
			</Box>
		</StyledErrorFallback>
	)
}
ErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
}

export default ErrorFallback
