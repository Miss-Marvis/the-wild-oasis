import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from './Button'
import Heading from './Heading'

const StyledConfirmDelete = styled.div`
	width: 40rem;
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
`

const Message = styled.p`
	color: var(--color-grey-500);
	margin-bottom: 1.2rem;
	line-height: 1.6;
`

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 1.2rem;
`

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
	return (
		<StyledConfirmDelete>
			<Heading as='h3'>Delete {resourceName}</Heading>
			<Message>
				Are you sure you want to delete this {resourceName} permanently? This
				action cannot be undone.
			</Message>

			<ButtonContainer>
				<Button
					$variation='secondary'
					disabled={disabled}
					onClick={onCloseModal}
				>
					Cancel
				</Button>
				<Button $variation='danger' disabled={disabled} onClick={onConfirm}>
					Delete
				</Button>
			</ButtonContainer>
		</StyledConfirmDelete>
	)
}

ConfirmDelete.propTypes = {
	resourceName: PropTypes.string.isRequired,
	onConfirm: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	onCloseModal: PropTypes.func.isRequired,
}

ConfirmDelete.defaultProps = {
	disabled: false,
}

export default ConfirmDelete
