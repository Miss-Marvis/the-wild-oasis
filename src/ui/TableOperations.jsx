// import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledTableOperations = styled.div`
	display: flex;
	align-items: center;
	gap: 1.6rem;

	flex-wrap: wrap;
	justify-content: flex-end;

	@media (max-width: 768px) {
		gap: 0.8rem;
		justify-content: center;
	}
`

export default function TableOperations({ children }) {
	return <StyledTableOperations>{children}</StyledTableOperations>
}

TableOperations.propTypes = {
	children: PropTypes.node.isRequired,
}
