/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useBooking } from '../bookings/useBooking'
import { useMoveBack } from '../../hooks/useMoveBack'
import Row from '../../ui/Row'
import Heading from '../../ui/Heading'
import ButtonText from '../../ui/ButtonText'
import { HiArrowLeft } from 'react-icons/hi2'
import BookingDataBox from '../bookings/BookingDataBox'
import ButtonGroup from '../../ui/ButtonGroup'
import Button from '../../ui/Button'
import Checkbox from '../../ui/Checkbox'
import Spinner from '../../ui/Spinner'
import { useCheckin } from './useCheckin'
import { useSettings } from '../settings/useSettings'

const Box = styled.div`
	background-color: var(--color-grey-0);
	border: 1px solid var(--color-grey-100);
	border-radius: var(--border-radius-md);
	padding: 2.4rem 4rem;
`

function CheckinBooking() {
	const { bookingId } = useParams()
	const moveBack = useMoveBack()
	const { checkin, isCheckingIn } = useCheckin()
	const [confirmPaid, setConfirmPaid] = useState(false)
	const [addBreakfast, setAddBreakfast] = useState(false)
	const { booking, isLoading } = useBooking()
	const { isLoading: isLoadingSettings } = useSettings

	useEffect(() => {
		if (booking) {
			setConfirmPaid(booking.isPaid || false)
			setAddBreakfast(booking.hasBreakfast || false)
		}
	}, [booking])

	// Early return for loading state
	if (isLoading || isLoadingSettings) return <Spinner />
	if (!booking) {
		return <div>Booking not found</div>
	}

	const { id, guests, totalPrice, numGuests, hasBreakfast, numNights, isPaid } =
		booking

	// Calculate breakfast price (example: $15 per guest per night)
	const optionalBreakfastPrice = 15 * numGuests * numNights

	function handleCheckin() {
		if (!confirmPaid) return

		// Prepare breakfast data if adding breakfast
		const breakfastData =
			addBreakfast && !hasBreakfast
				? {
						hasBreakfast: true,
						extrasPrice: optionalBreakfastPrice,
						totalPrice: totalPrice + optionalBreakfastPrice,
				  }
				: {}

		checkin({
			bookingId: id,
			breakfast: breakfastData,
		})
	}

	// Prevent check-in if not paid
	const isCheckinDisabled = !confirmPaid || isCheckingIn

	return (
		<>
			<Row type='horizontal'>
				<Heading as='h1'>
					<ButtonText onClick={moveBack}>
						<HiArrowLeft /> Back
					</ButtonText>
					Check in booking #{bookingId}
				</Heading>
			</Row>

			<BookingDataBox booking={booking} />

			{!hasBreakfast && (
				<Box>
					<Checkbox
						checked={addBreakfast}
						onChange={() => {
							setAddBreakfast((add) => !add)
							setConfirmPaid(false)
						}}
						id='breakfast'
					>
						Want to add breakfast for ${optionalBreakfastPrice}?
					</Checkbox>
				</Box>
			)}

			<Box>
				<Checkbox
					checked={confirmPaid}
					onChange={() => setConfirmPaid((confirm) => !confirm)}
					id='confirm'
					disabled={confirmPaid && isPaid}
				>
					I confirm that {guests?.fullName} has paid the total amount of{' '}
					{addBreakfast && !hasBreakfast
						? `$${
								totalPrice + optionalBreakfastPrice
						  } ($${totalPrice} + $${optionalBreakfastPrice})`
						: `$${totalPrice}`}
				</Checkbox>
			</Box>

			<ButtonGroup>
				<Button onClick={handleCheckin} disabled={isCheckinDisabled}>
					Check in booking #{bookingId}
				</Button>
				<Button variation='secondary' onClick={moveBack}>
					Back
				</Button>
			</ButtonGroup>
		</>
	)
}

export default CheckinBooking
