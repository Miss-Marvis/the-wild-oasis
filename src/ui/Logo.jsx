// import React from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../context/DarkModeContext'

const StyledLogo = styled.div`
	text-align: center;
`
const Img = styled.img`
	height: 9.6rem;
	width: auto;
`

export default function Logo() {
	console.log('Logo component is rendering') // Add this line
	const { isDarkMode } = useDarkMode()

	const src = isDarkMode ? '/logo-dark.png' : '/logo-light.jpg'

	return (
		<StyledLogo>
			<Img src={src} alt='Logo' />
		</StyledLogo>
	)
}
