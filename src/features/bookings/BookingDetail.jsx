import styled from 'styled-components'
import { format, isToday } from 'date-fns'
import { useBooking } from './useBooking'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/helpers'
import { formatDistanceFromNow } from '../../utils/helpers'
import { supabaseUrl } from '../../services/supabase'
import Tag from '../../ui/Tag'
import Button from '../../ui/Button'
import ButtonText from '../../ui/ButtonText'
import Spinner from '../../ui/Spinner'
import Row from '../../ui/Row'
import Heading from '../../ui/Heading'
import ButtonGroup from '../../ui/ButtonGroup'
import {
	HiArrowUpOnSquare,
	HiArrowDownOnSquare,
	HiArrowLeft,
} from 'react-icons/hi2'
import { useCheckout } from '../check-in-out/useCheckout'
import ConfirmDelete from '../../ui/ConfirmDelete'
import Modal from '../../ui/Modal'
// import { deleteBooking } from '../../services/apiBookings'
import { useDeleteBooking } from './useDeleteBooking'
import Empty from '../../ui/Empty'

const BookingDataBox = styled.section`
	background-color: var(--color-grey-0);
	border: 1px solid var(--color-grey-100);
	border-radius: var(--border-radius-md);
	overflow: hidden;
`

const Header = styled.header`
	background-color: var(--color-brand-500);
	padding: 2rem 4rem;
	color: #e0e7ff;
	font-size: 1.8rem;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: space-between;

	svg {
		height: 3.2rem;
		width: 3.2rem;
	}

	& div:first-child {
		display: flex;
		align-items: center;
		gap: 1.6rem;
		font-weight: 600;
		font-size: 1.8rem;
	}

	& span {
		font-family: 'Sono';
		font-size: 2rem;
		margin-left: 4px;
	}
`

const Section = styled.section`
	padding: 3.2rem 4rem 1.2rem;
`

const Guest = styled.div`
	display: flex;
	align-items: center;
	gap: 1.2rem;
	margin-bottom: 1.6rem;
	color: var(--color-grey-500);

	& p:first-of-type {
		font-weight: 500;
		color: var(--color-grey-700);
	}
`

const Price = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.6rem 3.2rem;
	border-radius: var(--border-radius-sm);
	margin-top: 2.4rem;

	background-color: ${(props) =>
		props.isPaid ? 'var(--color-green-100)' : 'var(--color-yellow-100)'};
	color: ${(props) =>
		props.isPaid ? 'var(--color-green-700)' : 'var(--color-yellow-700)'};

	& p:last-child {
		text-transform: uppercase;
		font-size: 1.4rem;
		font-weight: 600;
	}

	svg {
		height: 2.4rem;
		width: 2.4rem;
		color: currentColor !important;
	}
`

const Footer = styled.footer`
	padding: 1.6rem 4rem;
	font-size: 1.2rem;
	color: var(--color-grey-500);
	text-align: right;
`

const CabinImage = styled.img`
	width: 100%;
	max-width: 20rem;
	height: 15rem;
	object-fit: cover;
	border-radius: var(--border-radius-sm);
	border: 1px solid var(--color-grey-200);
`

const CabinInfo = styled.div`
	display: flex;
	gap: 2rem;
	align-items: center;
	margin-bottom: 2rem;
`

const CabinDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	& h3 {
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-grey-700);
	}

	& p {
		color: var(--color-grey-500);
		font-size: 1.4rem;
	}
`

const DataItem = styled.div`
	display: flex;
	align-items: center;
	gap: 1.6rem;
	padding: 0.8rem 0;

	& p:first-child {
		font-weight: 500;
		min-width: 15rem;
	}
`

function getSupabaseImageUrl(imagePath) {
	if (!imagePath) return null
	if (imagePath.startsWith('http')) return imagePath

	const BUCKET_NAME = 'cabin-images'
	return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`
}

function BookingDetail() {
	const { booking, isLoading, error } = useBooking()
	const navigate = useNavigate()
	const { checkout, isCheckingOut } = useCheckout()
	const { deleteBooking, isDeleting } = useDeleteBooking()

	if (isLoading) return <Spinner />
	if (!booking) return <Empty resourceName='booking' />

	if (error) return <div>Error loading booking details</div>

	const {
		id: bookingId,
		created_at,
		startDate,
		endDate,
		numNights,
		numGuests,
		cabinPrice,
		extrasPrice,
		totalPrice,
		hasBreakfast,
		observations,
		isPaid,
		status,
		guests,
		cabins,
	} = booking

	const statusToTagName = {
		unconfirmed: 'blue',
		'checked-in': 'green',
		'checked-out': 'silver',
	}

	return (
		<>
			<Row type='horizontal'>
				<Heading as='h1'>
					<ButtonText onClick={() => navigate(-1)}>
						<HiArrowLeft /> Back
					</ButtonText>
					Booking #{bookingId}
				</Heading>
				<Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
			</Row>

			<BookingDataBox>
				<Header>
					<div>
						{status === 'unconfirmed' && <HiArrowDownOnSquare />}
						{status === 'checked-in' && <HiArrowUpOnSquare />}
						{status === 'checked-out' && <HiArrowUpOnSquare />}
						<p>
							{numNights} nights in Cabin <span>{cabins?.name}</span>
						</p>
					</div>

					<p>
						{format(new Date(startDate), 'EEE, MMM dd yyyy')} (
						{isToday(new Date(startDate))
							? 'Today'
							: formatDistanceFromNow(startDate)}
						) &mdash; {format(new Date(endDate), 'EEE, MMM dd yyyy')}
					</p>
				</Header>

				<Section>
					{cabins && (
						<CabinInfo>
							{cabins.image && (
								<CabinImage
									src={getSupabaseImageUrl(cabins.image)}
									alt={`Cabin ${cabins.name}`}
								/>
							)}
							<CabinDetails>
								<h3>{cabins.name}</h3>
								<p>Maximum capacity: {cabins.maxCapacity} guests</p>
								<p>
									Regular price: {formatCurrency(cabins.regularPrice)} per night
								</p>
								{cabins.discount > 0 && (
									<p>Discount: {formatCurrency(cabins.discount)}</p>
								)}
							</CabinDetails>
						</CabinInfo>
					)}

					<Guest>
						<p>
							{guests?.fullName}{' '}
							{numGuests > 1 ? `+ ${numGuests - 1} guests` : ''}
						</p>
						<span>&bull;</span>
						<p>{guests?.email}</p>
						<span>&bull;</span>
						<p>National ID: {guests?.nationalID}</p>
						{guests?.nationality && (
							<>
								<span>&bull;</span>
								<p>{guests.nationality}</p>
							</>
						)}
					</Guest>

					<DataItem>
						<p>Number of nights:</p>
						<p>{numNights}</p>
					</DataItem>

					<DataItem>
						<p>Number of guests:</p>
						<p>{numGuests}</p>
					</DataItem>

					{observations && (
						<DataItem>
							<p>Observations:</p>
							<p>{observations}</p>
						</DataItem>
					)}

					<DataItem>
						<p>Breakfast included?</p>
						<p>{hasBreakfast ? 'Yes' : 'No'}</p>
					</DataItem>
					<ButtonGroup>
						.
						{status === 'unconfirmed' && (
							<Button onClick={() => navigate(`/checkin/${bookingId}`)}>
								Check in
							</Button>
						)}
						{status === 'checked-in' && (
							<Button
								icon={<HiArrowUpOnSquare />}
								onClick={() => checkout(bookingId)}
								disabled={isCheckingOut}
							>
								Check out
							</Button>
						)}
						<Modal>
							<Modal.Open opens='delete'>
								<Button variation='danger'>Delete booking</Button>
							</Modal.Open>

							<Modal.Window name='delete'>
								<ConfirmDelete
									resourceName='booking'
									disabled={isDeleting}
									onConfirm={() =>
										deleteBooking(bookingId, {
											onSettled: () => navigate(-1),
										})
									}
								/>
							</Modal.Window>
						</Modal>
						<Button variation='secondary' onClick={() => navigate(-1)}>
							<HiArrowLeft />
							Back
						</Button>
					</ButtonGroup>

					<Price isPaid={isPaid}>
						<div>
							<p>
								Total price: {formatCurrency(totalPrice)}
								{hasBreakfast &&
									` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
										extrasPrice
									)} breakfast)`}
							</p>
						</div>

						<p>{isPaid ? 'Paid' : 'Will pay onSite'}</p>
					</Price>
				</Section>

				<Footer>
					<p>Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}</p>
				</Footer>
			</BookingDataBox>

			{/* <ButtonGroup>
				{status === 'unconfirmed' && <Button>Check in</Button>}

				{status === 'checked-in' && <Button>Check out</Button>}
			</ButtonGroup> */}
		</>
	)
}

export default BookingDetail
