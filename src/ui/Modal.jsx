import { HiXMark } from 'react-icons/hi2'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { cloneElement, createContext, useContext, useState } from 'react'
import { useOutsideClicks } from '../hooks/useOutsideClicks'

const StyledModal = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: var(--color-grey-0);
	border-radius: var(--border-radius-lg);
	box-shadow: var(--shadow-lg);
	padding: 3.2rem 4rem;
	transition: all 0.5s;

	/* Desktop: Full width spanning */
	width: 70vw;
	max-width: 120rem;
	min-height: 60vh;
	max-height: 90vh;
	overflow-y: auto;

	/* Tablet adjustments */
	@media (max-width: 1024px) {
		width: 90vw;
		padding: 2.5rem 3rem;
	}

	/* Mobile adjustments - much more conservative */
	@media (max-width: 768px) {
		width: 95vw;
		max-width: none;
		min-height: auto;
		max-height: 85vh;
		padding: 2rem 1.5rem;
		border-radius: var(--border-radius-md);
	}

	/* Small mobile (375px and below) */
	@media (max-width: 480px) {
		width: 92vw;
		padding: 1.5rem 1.2rem;
		max-height: 80vh;
		border-radius: var(--border-radius-sm);
	}
`

const LargeModal = styled(StyledModal)`
	width: 98vw;
	max-width: 140rem;
	min-height: 70vh;

	/* Tablet */
	@media (max-width: 1024px) {
		width: 95vw;
	}

	/* Mobile */
	@media (max-width: 768px) {
		width: 95vw;
		min-height: auto;
		max-height: 85vh;
	}

	/* Small mobile */
	@media (max-width: 480px) {
		width: 92vw;
		max-height: 80vh;
	}
`

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: var(--backdrop-color);
	backdrop-filter: blur(4px);
	z-index: 1000;
	transition: all 0.5s;

	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;

	@media (max-width: 768px) {
		padding: 2rem 0;
		align-items: flex-start;
		overflow-y: auto;
	}

	@media (max-width: 480px) {
		padding: 1.5rem 0;
	}
`

const Button = styled.button`
	background: none;
	border: none;
	padding: 0.4rem;
	border-radius: var(--border-radius-sm);
	transition: all 0.2s;
	position: absolute;
	top: 1.2rem;
	right: 1.9rem;
	z-index: 10;

	&:hover {
		background-color: var(--color-grey-100);
	}

	& svg {
		width: 2.4rem;
		height: 2.4rem;
		stroke: var(--color-grey-500);
		color: var(--color-grey-500);
	}

	@media (max-width: 768px) {
		padding: 0.8rem;
		top: 1rem;
		right: 1rem;

		& svg {
			width: 2rem;
			height: 2rem;
		}
	}

	@media (max-width: 480px) {
		padding: 1rem;
		top: 0.5rem;
		right: 0.5rem;
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

const ModalContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	height: 100%;

	padding-top: 1rem;
`

const ImagePreviewSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	@media (min-width: 1024px) {
		flex-direction: row;
		align-items: flex-start;
	}

	/* Mobile: Always stack vertically */
	@media (max-width: 768px) {
		flex-direction: column;
		gap: 1.2rem;
	}
`

const ImageContainer = styled.div`
	flex: 0 0 auto;
	max-width: 100%;

	@media (min-width: 1024px) {
		flex: 0 0 30rem;
		max-width: 30rem;
	}

	img {
		width: 100%;
		height: auto;
		border-radius: var(--border-radius-md);
		box-shadow: var(--shadow-sm);
		object-fit: cover;
		max-height: 25rem;
	}

	@media (max-width: 768px) {
		img {
			max-height: 20rem;
			border-radius: var(--border-radius-sm);
		}
	}

	@media (max-width: 480px) {
		img {
			max-height: 15rem;
		}
	}
`

const ContentSection = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	min-width: 0;
`

const DescriptionArea = styled.div`
	textarea,
	.description-display {
		width: 100%;
		min-height: 12rem;
		padding: 1.2rem;
		border: 1px solid var(--color-grey-300);
		border-radius: var(--border-radius-md);
		font-family: inherit;
		font-size: 1.4rem;
		line-height: 1.6;
		resize: vertical;

		&:focus {
			outline: none;
			border-color: var(--color-brand-600);
			box-shadow: 0 0 0 3px var(--color-brand-200);
		}
	}

	.description-display {
		background-color: var(--color-grey-50);
		border: none;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
`

const FormRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.8rem;

	@media (min-width: 1024px) {
		flex-direction: row;
		align-items: center;
		gap: 2rem;
	}

	label {
		font-weight: 500;
		min-width: 12rem;
		flex-shrink: 0;
		font-size: 1.4rem;
	}

	input {
		flex: 1;
		padding: 0.8rem 1.2rem;
		border: 1px solid var(--color-grey-300);
		border-radius: var(--border-radius-sm);
		font-size: 1.4rem;

		&:focus {
			outline: none;
			border-color: var(--color-brand-600);
			box-shadow: 0 0 0 3px var(--color-brand-200);
		}
	}

	@media (max-width: 768px) {
		gap: 0.6rem;

		label {
			font-size: 1.3rem;
			min-width: auto;
		}

		input {
			padding: 1.2rem;
			font-size: 1.6rem;
			min-height: 44px;
		}
	}
`

const ModalContext = createContext()

function Modal({ children }) {
	const [openName, setOpenName] = useState('')
	const close = () => setOpenName('')
	const open = setOpenName

	return (
		<ModalContext.Provider value={{ openName, close, open }}>
			{children}
		</ModalContext.Provider>
	)
}

function Open({ children, opens: opensWindowName }) {
	const { open } = useContext(ModalContext)
	return cloneElement(children, { onClick: () => open(opensWindowName) })
}

function Window({ children, name, size = 'default' }) {
	const { openName, close } = useContext(ModalContext)
	const ref = useOutsideClicks(close)

	if (name !== openName) return null

	const ModalComponent = size === 'large' ? LargeModal : StyledModal

	return createPortal(
		<Overlay>
			<ModalComponent ref={ref}>
				<Button onClick={close}>
					<HiXMark />
				</Button>
				<ModalContent>
					{cloneElement(children, { onCloseModal: close })}
				</ModalContent>
			</ModalComponent>
		</Overlay>,
		document.body
	)
}

// Additional helper components for better content organization
Modal.ImagePreviewSection = ImagePreviewSection
Modal.ImageContainer = ImageContainer
Modal.ContentSection = ContentSection
Modal.DescriptionArea = DescriptionArea
Modal.FormRow = FormRow

Modal.propTypes = {
	children: PropTypes.node.isRequired,
}

Open.propTypes = {
	children: PropTypes.element.isRequired,
	opens: PropTypes.string.isRequired,
}

Window.propTypes = {
	children: PropTypes.element.isRequired,
	name: PropTypes.string.isRequired,
	size: PropTypes.oneOf(['default', 'large']),
}

Modal.Open = Open
Modal.Window = Window

export default Modal
