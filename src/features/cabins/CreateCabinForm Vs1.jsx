import Input from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import Button from '../../ui/Button'
import Form from '../../ui/Form'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createCabin } from '../../services/apiCabins'
import FormRow from '../../ui/FormRow'
import { useEffect } from 'react'
import PropTypes from 'prop-types' // ✅ Added for prop validation

function CreateCabinForm({ cabinToEdit = {}, onCloseForm }) {
	// ✅ FIX 1: Moved `editId` and `isEditSession` ABOVE useForm
	const { id: editId, ...editValues } = cabinToEdit
	const isEditSession = Boolean(editId)

	// ✅ FIX 2: Now useForm can properly detect edit mode
	const { register, handleSubmit, reset, getValues, formState } = useForm({
		defaultValues: isEditSession ? editValues : {},
	})

	useEffect(() => {
		if (isEditSession) {
			reset({ ...editValues, image: null })
		}
	}, [editId, reset, isEditSession, editValues])

	const { errors } = formState

	const queryClient = useQueryClient()

	const { mutate, isLoading: isCreating } = useMutation({
		mutationFn: createCabin,
		onSuccess: () => {
			toast.success(isEditSession ? 'Cabin updated' : 'Cabin created')
			queryClient.invalidateQueries({ queryKey: ['cabins'] })
			reset()
			if (onCloseForm) onCloseForm()
		},
		onError: (err) => toast.error(err.message),
	})

	function onSubmit(data) {
		mutate({ ...data, image: data.image[0] })
	}

	function onError(error) {
		console.log('❌ Form validation error:', error)
	}

	console.log('🧩 cabinToEdit:', cabinToEdit)
	console.log('🛠 editValues:', editValues)
	console.log('✏️ Edit mode?', isEditSession)

	return (
		<Form onSubmit={handleSubmit(onSubmit, onError)}>
			<FormRow label='Cabin name' error={errors?.name?.message}>
				<Input
					type='text'
					id='name'
					disabled={isCreating}
					{...register('name', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Max capacity' error={errors?.maxCapacity?.message}>
				<Input
					type='number'
					id='maxCapacity'
					disabled={isCreating}
					{...register('maxCapacity', {
						required: 'This field is required',
						min: {
							value: 1,
							message: 'Capacity should be at least 1',
						},
					})}
				/>
			</FormRow>

			<FormRow label='Regular price' error={errors?.regularPrice?.message}>
				<Input
					type='number'
					id='regularPrice'
					disabled={isCreating}
					{...register('regularPrice', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Discount' error={errors?.discount?.message}>
				<Input
					type='number'
					id='discount'
					disabled={isCreating}
					defaultValue={0}
					{...register('discount', {
						required: 'This field is required',
						validate: (value) =>
							value <= getValues().regularPrice ||
							'Discount should be less than regular price',
					})}
				/>
			</FormRow>

			<FormRow
				label='Description for website'
				error={errors?.description?.message}
			>
				<Textarea
					id='description'
					disabled={isCreating}
					{...register('description', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Cabin photo' error={errors?.image?.message}>
				<Input
					type='file'
					id='image'
					accept='image/*'
					{...register('image', {
						required: !isEditSession && 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow>
				<Button
					variation='secondary'
					type='button'
					onClick={() => {
						reset()
						if (onCloseForm) onCloseForm()
					}}
				>
					Cancel
				</Button>

				<Button disabled={isCreating}>
					{isEditSession ? 'Update cabin' : 'Add cabin'}
				</Button>
			</FormRow>
		</Form>
	)
}

// ✅ FIX 3: Add PropTypes
CreateCabinForm.propTypes = {
	cabinToEdit: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		maxCapacity: PropTypes.number,
		regularPrice: PropTypes.number,
		discount: PropTypes.number,
		image: PropTypes.string,
		description: PropTypes.string,
	}),
	onCloseForm: PropTypes.func,
}

export default CreateCabinForm
