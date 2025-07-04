import styled from 'styled-components'
import { format, formatDistance, isToday, parseISO } from 'date-fns'
import {
	HiOutlineChatBubbleBottomCenterText,
	HiOutlineCheckCircle,
	HiOutlineCurrencyDollar,
	HiOutlineHomeModern,
} from 'react-icons/hi2'
import PropTypes from 'prop-types'

import DataItem from '../../ui/DataItem'
import { Flag } from '../../ui/Flag'

const StyledBookingDataBox = styled.section`
	/* Box */
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

function BookingDataBox({ booking }) {
	const {
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
		guests,
		cabins,
	} = booking

	return (
		<StyledBookingDataBox>
			<Header>
				<div>
					<HiOutlineHomeModern />
					<p>
						{numNights} nights in Cabin <span>{cabins.name}</span>
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
				<Guest>
					{guests.countryFlag && (
						<Flag
							src={guests.countryFlag}
							alt={`Flag of ${guests.nationality}`}
						/>
					)}
					<p>
						{guests.fullName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ''}
					</p>
					<span>&bull;</span>
					<p>{guests.email}</p>
					<span>&bull;</span>
					<p>National ID {guests.nationalID}</p>
				</Guest>

				{observations && (
					<DataItem
						icon={<HiOutlineChatBubbleBottomCenterText />}
						label='Observations'
					>
						{observations}
					</DataItem>
				)}

				<DataItem icon={<HiOutlineCheckCircle />} label='Breakfast included?'>
					{hasBreakfast ? 'Yes' : 'No'}
				</DataItem>

				<Price isPaid={isPaid}>
					<DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
						${totalPrice}
						{hasBreakfast &&
							` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
								extrasPrice
							)} breakfast)`}
					</DataItem>

					<p>{isPaid ? 'Paid' : 'Will pay on site'}</p>
				</Price>
			</Section>

			<Footer>
				<p>Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}</p>
			</Footer>
		</StyledBookingDataBox>
	)
}

function formatDistanceFromNow(dateStr) {
	return formatDistance(parseISO(dateStr), new Date(), {
		addSuffix: true,
	}).replace('about ', '')
}

function formatCurrency(value) {
	return new Intl.NumberFormat('en', {
		style: 'currency',
		currency: 'USD',
	}).format(value)
}

BookingDataBox.propTypes = {
	booking: PropTypes.shape({
		created_at: PropTypes.string.isRequired,
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		numNights: PropTypes.number.isRequired,
		numGuests: PropTypes.number.isRequired,
		cabinPrice: PropTypes.number.isRequired,
		extrasPrice: PropTypes.number.isRequired,
		totalPrice: PropTypes.number.isRequired,
		hasBreakfast: PropTypes.bool.isRequired,
		observations: PropTypes.string,
		isPaid: PropTypes.bool.isRequired,
		guests: PropTypes.shape({
			fullName: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			nationality: PropTypes.string,
			nationalID: PropTypes.string,
			countryFlag: PropTypes.string,
		}).isRequired,
		cabins: PropTypes.shape({
			name: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
}

export default BookingDataBox
