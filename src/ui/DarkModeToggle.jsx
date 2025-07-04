// import React from 'react'
import { HiOutlineSun } from 'react-icons/hi2'
import { useDarkMode } from '../context/DarkModeContext'
import ButtonIcon from './ButtonIcon'
import { HiOutlineMoon } from 'react-icons/hi'

export default function DarkModeToggle() {
	const { isDarkMode, toggleDarkMode } = useDarkMode()
	return (
		<ButtonIcon onClick={toggleDarkMode}>
			{isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
		</ButtonIcon>
	)
}
