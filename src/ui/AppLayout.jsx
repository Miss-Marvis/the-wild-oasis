import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import styled from 'styled-components'

const StyledAppLayout = styled.div`
	display: grid;
	grid-template-columns: 26rem 1fr;
	grid-template-rows: auto 1fr;
	height: 100vh;

	@media (max-width: 768px) {
		grid-template-columns: 1fr; /* Single column on mobile */
		grid-template-rows: auto auto 1fr; /* Header, mobile nav, content */
	}
`

const Main = styled.main`
	background-color: var(--color-grey-50);
	padding: 4rem 4.8rem 6.4rem;
	overflow: scroll;

	@media (max-width: 768px) {
		padding: 2rem 1.6rem 3.2rem; /* Less padding on mobile */
	}
`

const Container = styled.div`
	max-width: 120rem;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;

	@media (max-width: 768px) {
		gap: 2rem;/* Smaller gaps on mobile */
	}
`


const MobileOverlay = styled.div`
	display: none;

	@media (max-width: 768px) {
		display: ${(props) => (props.isOpen ? 'block' : 'none')};
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}
`

export default function AppLayout() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<StyledAppLayout>
			<Header
				onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				isMobileMenuOpen={isMobileMenuOpen}
			/>
			<Sidebar
				isMobileMenuOpen={isMobileMenuOpen}
				onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
			/>
			<Main>
				<Container>
					<Outlet />
				</Container>
			</Main>
			<MobileOverlay
				isOpen={isMobileMenuOpen}
				onClick={() => setIsMobileMenuOpen(false)}
			/>
		</StyledAppLayout>
	)
}
