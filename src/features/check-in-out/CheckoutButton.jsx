import Button from '../../ui/Button'
import { useCheckout } from './useCheckout'
import PropTypes from 'prop-types'

function CheckoutButton({ bookingid }) {
	const { checkout, isCheckingOut } = useCheckout()

	return (
		<Button
			variation='primary'
			size='small'
			onClick={() => checkout(bookingid)}
			disabled={isCheckingOut}
		>
			Checkout
		</Button>
	)
}

CheckoutButton.propTypes = {
	bookingid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
}
export default CheckoutButton
