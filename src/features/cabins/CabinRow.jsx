// import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { formatCurrency } from '../../utils/helpers'
import CreateCabinForm from './CreateCabinForm'
import { useDeleteCabin } from './useDeleteCabin'
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2'
import { useCreateCabin } from './useCreateCabin'
import Modal from '../../ui/Modal'
import ConfirmDelete from '../../ui/ConfirmDelete'
import Table from '../../ui/Table'
import Menus from '../../ui/Menus'

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

const Img = styled.img`
	display: block;
	width: 6.4rem;
	aspect-ratio: 3 / 2;
	object-fit: cover;
	object-position: center;
	transform: scale(1.5) translateX(-7px);
`

function CabinRow({ cabin }) {
	const { isDeleting, deleteCabin } = useDeleteCabin()
	const { isCreating, createCabin } = useCreateCabin()

	// Early return for invalid cabin data
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
		description = '',
	} = cabin

	function handleDuplicate() {
		createCabin({
			name: `Copy of ${name}`,
			maxCapacity,
			regularPrice,
			discount,
			image,
			description,
		})
	}

	return (
		<Table.Row>
			<Img src={image} alt={`Image of ${name}`} />
			<CabinName>{name}</CabinName>
			<div>
				Fits up to {maxCapacity} guest{maxCapacity !== 1 ? 's' : ''}
			</div>
			<Price>{formatCurrency(regularPrice)}</Price>
			{discount ? (
				<Discount>{formatCurrency(discount)}</Discount>
			) : (
				<span>&mdash;</span>
			)}
			<div>
				<Modal>
					<Menus.Menu>
						<Menus.Toggle id={cabinId} />
						<Menus.List id={cabinId}>
							<Menus.Button
								icon={<HiSquare2Stack />}
								onClick={handleDuplicate}
								disabled={isCreating}
							>
								Duplicate
							</Menus.Button>

							<Modal.Open opens='edit'>
								<Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
							</Modal.Open>

							<Modal.Open opens='delete'>
								<Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
							</Modal.Open>
						</Menus.List>
					</Menus.Menu>

					<Modal.Window name='edit'>
						<CreateCabinForm cabinToEdit={cabin} onCloseForm={close} />
					</Modal.Window>

					<Modal.Window name='delete'>
						<ConfirmDelete
							resourceName='cabins'
							disabled={isDeleting}
							onConfirm={() => deleteCabin(cabinId)}
							onCloseModal={() => {}}
						/>
					</Modal.Window>
				</Modal>
			</div>
		</Table.Row>
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
	}).isRequired,
}

export default CabinRow
