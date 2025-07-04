import { useBookings } from './useBookings'
import Empty from '../../ui/Empty'
import Menus from '../../ui/Menus'
import Table from '../../ui/Table'
import BookingRow from './BookingRow'
import Spinner from '../../ui/Spinner'
import Pagination from '../../ui/Pagination'

export default function BookingTable() {
	const { bookings, isLoading, error, count } = useBookings()

	if (isLoading) {
		return <Spinner />
	}

	if (error) {
		return <div>Error: {error.message}</div>
	}

	if (!bookings?.length) {
		return <Empty resourceName='bookings' />
	}

	return (
		<Menus>
			<Table columns='0.8fr 2fr 2.2fr 1.2fr 1.1fr 0.8fr'>
				<Table.Header>
					<div>Cabin</div>
					<div>Guest</div>
					<div>Dates</div>
					<div>Status</div>
					<div>Amount</div>
					<div></div>
				</Table.Header>
				<Table.Body
					data={bookings}
					render={(booking) => (
						<BookingRow key={booking.id} booking={booking} />
					)}
				/>
				<Table.Footer>
					<Pagination count={count} />
				</Table.Footer>
			</Table>
		</Menus>
	)
}
