// import React from 'react'

import TableOperations from '../../ui/TableOperations'
import Filter from '../../ui/Filter'
import SortBy from '../../ui/SortBy'

export default function CabinTableOperations() {
	return (
		<TableOperations>
			<Filter
				filteredField='discount'
				options={[
					{ value: 'all', label: 'All' },
					{ value: 'no-discount', label: 'No discount' },
					{ value: 'all-discount', label: ' All discount' },
				]}
			/>
			<SortBy
				options={[
					{ value: 'name-asc', label: 'sort by name(A-Z)' },
					{ value: 'name-desc', label: 'Sort by name(Z-A)' },
					{ value: 'regularPrice-asc', label: 'Sort by price (low first)' },
					{ value: 'regularPrice-desc', label: 'Sort by price (high first)' },
					{ value: 'maxCapacity-asc', label: 'Sort by capacity (low first)' },
					{ value: 'maxCapacity-desc', label: 'Sort by capacity (high first)' },
				]}
			/>
		</TableOperations>
	)
}
