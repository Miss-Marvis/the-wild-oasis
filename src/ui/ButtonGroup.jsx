import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledButtonGroup = styled.div`
	display: flex;
	gap: 1.2rem;
	justify-content: flex-end;
	align-items: center;
	margin-top: 2.4rem;
	padding: 1.6rem 0;

	/* Responsive design for smaller screens */
	@media (max-width: 768px) {
		flex-direction: column;
		gap: 1rem;

		& > * {
			width: 100%;
		}
	}

	/* Alternative layout options */
	&.center {
		justify-content: center;
	}

	&.left {
		justify-content: flex-start;
	}

	&.space-between {
		justify-content: space-between;
	}

	&.wrap {
		flex-wrap: wrap;
	}
`

function ButtonGroup({ children, className, align = 'right', ...props }) {
	return (
		<StyledButtonGroup className={`${align} ${className || ''}`} {...props}>
			{children}
		</StyledButtonGroup>
	)
}

ButtonGroup.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	align: PropTypes.oneOf(['right', 'left', 'center', 'space-between', 'wrap']),
}

ButtonGroup.defaultProps = {
	className: '',
	align: 'right',
}

export default ButtonGroup
