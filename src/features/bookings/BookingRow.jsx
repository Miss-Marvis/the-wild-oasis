import styled from 'styled-components'
import PropTypes from 'prop-types'
import { format, isToday } from 'date-fns'
import Tag from '../../ui/Tag'
import Table from '../../ui/Table'
import { formatCurrency } from '../../utils/helpers'
import { formatDistanceFromNow } from '../../utils/helpers'
import { supabaseUrl } from '../../services/supabase'
import Menus from '../../ui/Menus'
import {
	HiArrowDownOnSquare,
	HiArrowUpOnSquare,
	HiEye,
	HiTrash,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from '../check-in-out/useCheckout'
import Modal from '../../ui/Modal'
import ConfirmDelete from '../../ui/ConfirmDelete'
import { useDeleteBooking } from './useDeleteBooking'
import Spinner from '../../ui/Spinner'
// import { id } from 'date-fns/locale'

const Cabin = styled.div`
	font-size: 1.6rem;
	font-weight: 600;
	color: var(--color-grey-600);
	font-family: 'Sono';
	display: flex;
	align-items: center;
	gap: 1rem;
`

const CabinImage = styled.img`
	width: 6rem;
	height: 4rem;
	object-fit: cover;
	border-radius: 0.5rem;
	border: 1px solid var(--color-grey-200);
`

const CabinImagePlaceholder = styled.div`
	width: 6rem;
	height: 4rem;
	background-color: var(--color-grey-200);
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	color: var(--color-grey-500);
	text-align: center;
	flex-direction: column;
`

const Stacked = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	& span:first-child {
		font-weight: 500;
	}
	& span:last-child {
		color: var(--color-grey-500);
		font-size: 1.2rem;
	}
`

const Amount = styled.div`
	font-family: 'Sono';
	font-weight: 500;
`

const ErrorText = styled.span`
	color: var(--color-red-700);
	font-style: italic;
`

function getSupabaseImageUrl(imagePath) {
	if (!imagePath) return null

	if (imagePath.startsWith('http')) {
		return imagePath
	}

	const BUCKET_NAME = 'cabin-images'

	return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`
}

function BookingRow({ booking }) {
	const {
		id: bookingId,
		startDate,
		endDate,
		numNights,
		totalPrice,
		status = 'unconfirmed',
		guests,
		cabins,
		guestId,
		// cabinId,
	} = booking

	const navigate = useNavigate()
	const { checkout, isCheckingOut } = useCheckout()
	const { deleteBooking, isDeleting } = useDeleteBooking()

	if (isDeleting) return <Spinner />

	// Handle guest data
	const getGuestInfo = () => {
		if (guests && guests.fullName) {
			return {
				fullName: guests.fullName,
				email: guests.email || 'No email provided',
			}
		}
		return {
			fullName: 'Unknown Guest',
			email: guestId
				? `Guest ID: ${guestId} (Data missing)`
				: 'No guest assigned',
		}
	}

	const getCabinInfo = () => {
		if (cabins && cabins.image) {
			const imageUrl = getSupabaseImageUrl(cabins.image)
			return {
				image: imageUrl,
			}
		}
		return {
			image: null,
		}
	}

	const { fullName: guestName, email } = getGuestInfo()
	const { image: cabinImage } = getCabinInfo()

	const statusToTagName = {
		unconfirmed: 'blue',
		'checked-in': 'green',
		'checked-out': 'silver',
	}

	const normalizedStatus = status.toLowerCase()
	const tagColor = statusToTagName[normalizedStatus] || 'gray'

	const hasDataIssues = !guests || !cabins

	return (
		<Table.Row>
			<Cabin>
				{cabinImage ? (
					<CabinImage
						src={cabinImage}
						alt='Cabin'
						onError={(e) => {
							console.error('Image load error for:', cabinImage)

							e.target.style.display = 'none'
							const placeholder =
								e.target.parentNode.querySelector('.image-placeholder')
							if (placeholder) {
								placeholder.style.display = 'flex'
							}
						}}
					/>
				) : (
					<CabinImagePlaceholder className='image-placeholder'>
						No Image
					</CabinImagePlaceholder>
				)}
			</Cabin>

			<Stacked>
				<span>
					{hasDataIssues ? <ErrorText>{guestName}</ErrorText> : guestName}
				</span>
				<span>{hasDataIssues ? <ErrorText>{email}</ErrorText> : email}</span>
			</Stacked>

			<Stacked>
				<span>
					{isToday(new Date(startDate))
						? 'Today'
						: formatDistanceFromNow(startDate)}{' '}
					&rarr; {numNights} night stay
				</span>
				<span>
					{format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
					{format(new Date(endDate), 'MMM dd yyyy')}
				</span>
			</Stacked>

			<Tag type={hasDataIssues ? 'red' : tagColor}>
				{hasDataIssues ? 'Data Issue' : status.replace('-', ' ')}
			</Tag>

			<Amount>{formatCurrency(totalPrice)}</Amount>

			{/* <div></div> */}
			<Modal>
				<Menus.Menu>
					<Menus.Toggle id={bookingId} />
					<Menus.List id={bookingId}>
						<Menus.Button
							icon={<HiEye />}
							onClick={() => navigate(`/bookings/${bookingId}`)}
						>
							See details
						</Menus.Button>
						{status === 'unconfirmed' && (
							<Menus.Button
								icon={<HiArrowDownOnSquare />}
								onClick={() => navigate(`/checkin/${bookingId}`)}
							>
								Check in
							</Menus.Button>
						)}
						{status === 'checked-in' && (
							<Menus.Button
								icon={<HiArrowUpOnSquare />}
								onClick={() => checkout(bookingId)}
								disabled={isCheckingOut}
							>
								Check out
							</Menus.Button>
						)}

						<Modal.Open opens='delete'>
							<Menus.Button icon={<HiTrash />}> Delete Bookings</Menus.Button>
						</Modal.Open>
					</Menus.List>
				</Menus.Menu>

				<Modal.Window name='delete'>
					<ConfirmDelete
						resourceName='booking'
						disabled={isDeleting}
						onConfirm={() => deleteBooking(bookingId)}
					/>
				</Modal.Window>
			</Modal>
		</Table.Row>
	)
}

BookingRow.propTypes = {
	booking: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		numNights: PropTypes.number.isRequired,
		totalPrice: PropTypes.number.isRequired,
		id: PropTypes.number.isRequired,
		status: PropTypes.string,
		guests: PropTypes.shape({
			fullName: PropTypes.string,
			email: PropTypes.string,
		}),
		cabins: PropTypes.shape({
			name: PropTypes.string,
			image: PropTypes.string,
		}),
		guestId: PropTypes.number,
		cabinId: PropTypes.number,
	}).isRequired,
}

export default BookingRow
