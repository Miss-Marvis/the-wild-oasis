import styled from 'styled-components'

const DashboardBox = styled.div`
	/* Basic box styling */
	background-color: var(--color-grey-0);
	border: 1px solid var(--color-grey-100);
	border-radius: var(--border-radius-md);

	/* Padding and spacing */
	padding: 3.2rem;

	/* Grid positioning - can be overridden by parent components */
	display: flex;
	flex-direction: column;
	gap: 2.4rem;

	/* Shadow for depth */
	box-shadow: var(--shadow-sm);

	/* Responsive behavior */
	@media (max-width: 768px) {
		padding: 2rem;
		gap: 1.6rem;
	}
`

export default DashboardBox
