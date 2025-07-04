import { useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Main table container
const StyledTable = styled.div`
	border: 1px solid var(--color-grey-200);
	font-size: 1.4rem;
	background-color: var(--color-grey-0);
	border-radius: 7px;
	overflow: hidden;
`

// Common row component used by header and body rows
const CommonRow = styled.div`
	display: grid;
	grid-template-columns: ${(props) => props.columns};
	column-gap: 2.4rem;
	align-items: center;
	transition: none;
`

// Table header
const StyledHeader = styled(CommonRow)`
	padding: 1.6rem 2.4rem;
	background-color: var(--color-grey-50);
	border-bottom: 1px solid var(--color-grey-100);
	text-transform: uppercase;
	letter-spacing: 0.4px;
	font-weight: 600;
	color: var(--color-grey-600);
`

// Table body container
const StyledBody = styled.section`
	margin: 0.4rem 0;
`

// Individual table row
const StyledRow = styled(CommonRow)`
	padding: 1.2rem 2.4rem;
	&:not(:last-child) {
		border-bottom: 1px solid var(--color-grey-100);
	}
`

// Footer component
const Footer = styled.footer`
	background-color: var(--color-grey-50);
	display: flex;
	justify-content: center;
	padding: 1.2rem;
	/* This will hide the footer when it contains no child elements */
	&:not(:has(*)) {
		display: none;
	}
`

// Empty state message
const Empty = styled.p`
	font-size: 1.6rem;
	font-weight: 500;
	text-align: center;
	margin: 2.4rem;
`

const TableContext = createContext()

function Table({ columns, children }) {
	return (
		<TableContext.Provider value={{ columns }}>
			<StyledTable role='table'>{children}</StyledTable>
		</TableContext.Provider>
	)
}

Table.propTypes = {
	columns: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
}

function Header({ children }) {
	const { columns } = useContext(TableContext)
	return (
		<StyledHeader role='row' columns={columns} as='header'>
			{children}
		</StyledHeader>
	)
}

Header.propTypes = {
	children: PropTypes.node.isRequired,
}

function Row({ children }) {
	const { columns } = useContext(TableContext)
	return (
		<StyledRow role='row' columns={columns}>
			{children}
		</StyledRow>
	)
}

Row.propTypes = {
	children: PropTypes.node.isRequired,
}

function Body({ data, render }) {
	if (!data?.length) return <Empty>No data to show at the moment</Empty>

	return <StyledBody>{data.map(render)}</StyledBody>
}

Body.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	render: PropTypes.func.isRequired,
}

Table.Header = Header
Table.Row = Row
Table.Body = Body
Table.Footer = Footer

export default Table
