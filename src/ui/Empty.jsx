// import React from 'react'
import PropTypes from 'prop-types'

export default function Empty({ resourceName }) {
	return <p> No {resourceName} could be found</p>
}
Empty.propTypes = {
	resourceName: PropTypes.string.isRequired,
}
