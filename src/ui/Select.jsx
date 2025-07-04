import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledSelect = styled.select`
	font-size: 1.4rem;
	padding: 0.8rem 1.2rem;
	border: 1px solid
		${(props) =>
			props.type === 'white'
				? 'var(--color-grey-100)'
				: 'var(--color-grey-300)'};
	border-radius: var(--border-radius-sm);
	background-color: var(--color-grey-0);
	font-weight: 500;
	box-shadow: var(--shadow-sm);
`

const Option = styled.option``

export function Select({
	options = [],
	value = '',
	onChange = () => {},
	type = 'default',
	...props
}) {
	return (
		<StyledSelect value={value} onChange={onChange} type={type} {...props}>
			{options.map((option) => (
				<Option value={option.value} key={option.value}>
					{option.label}
				</Option>
			))}
		</StyledSelect>
	)
}

// PropTypes for Select
Select.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			label: PropTypes.string.isRequired,
		})
	),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	type: PropTypes.oneOf(['white', 'default']),
}

export default Select
