import PropTypes from 'prop-types'
import Select from './Select'
import { useSearchParams } from 'react-router-dom'

export default function SortBy({ options = [] }) {
	const [searchParams, setSearchParams] = useSearchParams()

	const sortBy =
		searchParams.get('sortBy') || (options.length > 0 ? options[0].value : '')

	function handleChange(e) {
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set('sortBy', e.target.value)
		setSearchParams(newSearchParams)
	}

	return (
		<Select
			options={options}
			type='white'
			value={sortBy}
			onChange={handleChange}
		/>
	)
}

// PropTypes for SortBy
SortBy.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			label: PropTypes.string.isRequired,
		})
	),
}
