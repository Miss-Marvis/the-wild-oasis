// import React from 'react'

import styled from 'styled-components'

const StyledLogo = styled.div`
	text-align: center;
`

const Img = styled.img`
	height: 9.6rem;
	width: auto;
`
export default function Logo() {
	return (
		<StyledLogo>
			<Img src='./logo.jpg' alt='Logo' />
		</StyledLogo>
	)
}
