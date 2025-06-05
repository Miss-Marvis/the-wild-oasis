import styled from 'styled-components'
import PropTypes from 'prop-types'
import { formatCurrency } from '../../utils/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCabin } from '../../services/apiCabins'
import toast from 'react-hot-toast'
import { useState } from 'react'
import CreateCabinForm from './CreateCabinForm'

const CabinName = styled.div`
	font-size: 1.6rem;
	font-weight: 600;
	color: var(--color-grey-600);
	font-family: 'Sono';
`

const Price = styled.div`
	font-family: 'Sono';
	font-weight: 600;
`

const Discount = styled.div`
	font-family: 'Sono';
	font-weight: 500;
	color: var(--color-green-700);
`

const TableRow = styled.div`
	display: grid;
	grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
	column-gap: 2.4rem;
	align-items: center;
	padding: 1.4rem 2.4rem;
	&:not(:last-child) {
		border-bottom: 1px solid var(--color-grey-100);
	}
`

const Img = styled.img`
	display: block;
	width: 6.4rem;
	aspect-ratio: 3 / 2;
	object-fit: cover;
	object-position: center;
	transform: scale(1.5) translateX(-7px);
`

function CabinRow({ cabin }) {
	const [showForm, setShowForm] = useState(false)
	const queryClient = useQueryClient()

	const { isLoading: isDeleting, mutate } = useMutation({
		mutationFn: deleteCabin,
		onSuccess: () => {
			toast.success('Cabin successfully deleted')
			queryClient.invalidateQueries({ queryKey: ['cabins'] })
		},
		onError: (err) => {
			toast.error(err.message)
		},
	})

	if (!cabin || typeof cabin !== 'object') {
		console.warn('CabinRow received invalid cabin prop:', cabin)
		return null
	}

	const {
		id: cabinId,
		name = 'Unnamed Cabin',
		maxCapacity = 0,
		regularPrice = 0,
		discount = 0,
		image = '',
	} = cabin

	console.log('🧩 Cabin data passed to CreateCabinForm:', cabin)

	return (
		<>
			<TableRow>
				<Img src={image} alt={`Image of ${name}`} />
				<CabinName>{name}</CabinName>
				<div>
					Fits up to {maxCapacity} guest{maxCapacity !== 1 ? 's' : ''}
				</div>
				<Price>{formatCurrency(regularPrice)}</Price>
				<Discount>{discount > 0 ? formatCurrency(discount) : '—'}</Discount>

				<div>
					<button onClick={() => setShowForm((s) => !s)}>Edit</button>
					<button onClick={() => mutate(cabinId)} disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</TableRow>

			{showForm && (
				<CreateCabinForm
					key={cabin.id}
					cabinToEdit={cabin}
					onCloseForm={() => setShowForm(false)}
				/>
			)}
		</>
	)
}

CabinRow.propTypes = {
	cabin: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string,
		maxCapacity: PropTypes.number,
		regularPrice: PropTypes.number,
		discount: PropTypes.number,
		image: PropTypes.string,
		description: PropTypes.string,
	}),
}

export default CabinRow
