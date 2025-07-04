import { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiEllipsisVertical } from 'react-icons/hi2'
import { useOutsideClicks } from '../hooks/useOutsideClicks'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledToggle = styled.button`
	background: none;
	border: none;
	padding: 0.4rem;
	border-radius: var(--border-radius-sm);
	transform: translateX(0.8rem);
	transition: all 0.2s;

	&:hover {
		background-color: var(--color-grey-100);
	}

	& svg {
		width: 2.4rem;
		height: 2.4rem;
		color: var(--color-grey-700);
	}
`

const StyledList = styled.ul`
	position: fixed;
	background-color: var(--color-grey-0);
	box-shadow: var(--shadow-md);
	border-radius: var(--border-radius-md);

	right: ${(props) => props.position?.x}px;
	top: ${(props) => props.position?.y}px;
`

const StyledButton = styled.button`
	width: 100%;
	text-align: left;
	background: none;
	border: none;
	padding: 1.2rem 2.4rem;
	font-size: 1.4rem;
	transition: all 0.2s;

	display: flex;
	align-items: center;
	gap: 1.6rem;

	&:hover {
		background-color: var(--color-grey-50);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	& svg {
		width: 1.6rem;
		height: 1.6rem;
		color: var(--color-grey-400);
		transition: all 0.3s;
	}
`

const MenusContext = createContext()

export default function Menus({ children }) {
	const [openId, setOpenId] = useState('')
	const [position, setPosition] = useState(null)

	const close = () => setOpenId('')
	const open = setOpenId

	return (
		<MenusContext.Provider
			value={{ openId, close, open, position, setPosition }}
		>
			{children}
		</MenusContext.Provider>
	)
}

Menus.propTypes = {
	children: PropTypes.node.isRequired,
}

function Menu({ children }) {
	return <div>{children}</div>
}

Menu.propTypes = {
	children: PropTypes.node.isRequired,
}

function Toggle({ id }) {
	const { openId, close, open, setPosition } = useContext(MenusContext)

	function handleClick(e) {
		e.stopPropagation()

		const rect = e.target.closest('button').getBoundingClientRect()
		setPosition({
			x: window.innerWidth - rect.width - rect.x,
			y: rect.y + rect.height + 8,
		})

		openId === '' || openId !== id ? open(id) : close()
	}

	return (
		<StyledToggle onClick={handleClick}>
			<HiEllipsisVertical />
		</StyledToggle>
	)
}

Toggle.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

function List({ id, children }) {
	const { openId, position, close } = useContext(MenusContext)
	const ref = useOutsideClicks(close)

	if (openId !== id) return null

	return createPortal(
		<StyledList position={position} ref={ref}>
			{children}
		</StyledList>,
		document.body
	)
}

List.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	children: PropTypes.node.isRequired,
}

function Button({ children, icon, onClick, disabled = false }) {
	const { close } = useContext(MenusContext)

	function handleClick() {
		if (disabled) return
		onClick?.()
		close()
	}

	return (
		<li>
			<StyledButton onClick={handleClick} disabled={disabled}>
				{icon}
				<span>{children}</span>
			</StyledButton>
		</li>
	)
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	icon: PropTypes.element,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
}

Menus.Menu = Menu
Menus.Toggle = Toggle
Menus.List = List
Menus.Button = Button
