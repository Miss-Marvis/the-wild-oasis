// import React from 'react'

// import { useState } from 'react'
import Button from './Button'
import CreateCabinForm from '../features/cabins/CreateCabinForm'
import Modal from './Modal'

function AddCabin() {
	return (
		<div>
			<Modal>
				<Modal.Open opens='cabin-form'>
					<Button>Add new cabin</Button>
				</Modal.Open>
				<Modal.Window name='cabin-form'>
					<CreateCabinForm />
				</Modal.Window>
			</Modal>
		</div>
	)
}

// export default function AddCabin() {
// 	const [isOpenModal, setIsOpenModal] = useState(false)
// 	return (
// 		<div>
// 			<Button onClick={() => setIsOpenModal((show) => !show)}>
// 				Add new Cabin
// 			</Button>
// 			{isOpenModal && (
// 				<Modal onClose={() => setIsOpenModal(false)}>
// 					<CreateCabinForm onCloseForm={() => setIsOpenModal(false)} />
// 				</Modal>
// 			)}
// 		</div>
// 	)
// }

export default AddCabin
