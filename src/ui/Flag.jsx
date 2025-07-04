import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledFlag = styled.span`
	font-size: 2rem;
	display: block;
	border-radius: var(--border-radius-tiny);
`

export function Flag({ countryFlag, alt }) {
	return <StyledFlag title={alt}>{countryFlag}</StyledFlag>
}

Flag.propTypes = {
	countryFlag: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
}
export default Flag
