// import React from 'reimportact'
import styled from 'styled-components'
import HeaderMenu from './HeaderMenu'
import UserAvater from '../features/authentication/UserAvatar'

const StyledHeader = styled.header`
	padding: 1.2rem 4.8rem;
	background-color: var(--color-grey-0);
	border-bottom: 1px solid var(--color-grey-100);

	display: flex;
	gap: 2.4rem;
	align-items;
	justify-content: flex-end;
`
export default function Header() {
	return (
		<StyledHeader>
			<UserAvater />
			<HeaderMenu />
		</StyledHeader>
	)
}
