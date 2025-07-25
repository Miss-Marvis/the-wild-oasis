import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import {
	HiOutlineCalendarDays,
	HiOutlineCog6Tooth,
	HiOutlineHome,
	HiOutlineHomeModern,
	HiOutlineUsers,
} from 'react-icons/hi2'

const NavList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
`

const StylesNavLink = styled(NavLink)`
	&:link,
	&:visited {
		display: flex;
		align-items: center;
		gap: 1.2rem;

		color: var(--color-grey-600);
		font-size: 1.6rem;
		font-weight: 500;
		padding: 1.2rem 2.4rem;
		transition: all 0.3s;
	}

	&:hover,
	&:active,
	&.active,
	&.active:link,
	&.active:visited {
		color: var(--color-grey-800);
		background-color: var(--color-grey-50);
		border-radius: var(--border-radius-sm);
	}

	& svg {
		width: 2.4rem;
		height: 2.4rem;
		color: var(--color-grey-400);
		transition: all 0.3s;
	}

	&:hover svg,
	&.active svg,
	&.active:link svg,
	&.active:visited svg {
		color: var(--color-brand-600);
	}
`

export default function MainNav() {
	return (
		<nav>
			<NavList>
				<li>
					<StylesNavLink to='/dashboard'>
						<HiOutlineHome />
						<span>Home</span>
					</StylesNavLink>{' '}
				</li>
				<li>
					<StylesNavLink to='/bookings'>
						<HiOutlineCalendarDays />
						<span>Bookings</span>
					</StylesNavLink>{' '}
				</li>

				<li>
					<StylesNavLink to='/cabins'>
						<HiOutlineHomeModern />
						<span>Cabins</span>
					</StylesNavLink>{' '}
				</li>

				<li>
					<StylesNavLink to='/users'>
						<HiOutlineUsers />
						<span>Users</span>
					</StylesNavLink>{' '}
				</li>

				<li>
					<StylesNavLink to='/settings'>
						<HiOutlineCog6Tooth />
						<span>Settings</span>
					</StylesNavLink>{' '}
				</li>
			</NavList>
		</nav>
	)
}
