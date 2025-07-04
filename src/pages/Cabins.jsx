// import React from 'react'

import CabinTable from '../features/cabins/CabinTable'
import Heading from '../ui/Heading'
import Row from '../ui/Row'
import CabinTableOperations from '../features/cabins/CabinTableOperations'
import AddCabin from '../ui/AddCabin'

export default function Cabins() {
	return (
		<>
			<Row type='horizontal'>
				<Heading as='h1'>All cabins</Heading>
				<CabinTableOperations />
			</Row>
			<Row>
				<CabinTable />
				<AddCabin />
			</Row>
		</>
	)
}
