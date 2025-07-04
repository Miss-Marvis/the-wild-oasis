import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import Input from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import Button from '../../ui/Button'
import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'

import { useCreateCabin } from './useCreateCabin'
import { useEditCabin } from './useEditCabin'

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
	console.log('Form loaded with onCloseForm:', onCloseModal)

	const { id: editId, ...editValues } = cabinToEdit
	const isEditSession = Boolean(editId)

	const { register, handleSubmit, reset, getValues, formState, watch } =
		useForm({
			defaultValues: isEditSession ? editValues : {},
		})

	const { errors } = formState

	// Watch the image field to show preview
	const watchedImage = watch('image')

	// Custom hooks for cabin operations
	const { createCabin, isCreating } = useCreateCabin()
	const { editCabin, isEditing } = useEditCabin()

	const isWorking = isCreating || isEditing

	function onSubmit(data) {
		// Handle image: if it's a string, keep it; if it's a FileList, get first file
		const image = typeof data.image === 'string' ? data.image : data.image?.[0]

		if (isEditSession) {
			// If no new image is provided during edit, use the existing image
			const imageToUse = image || editValues.image
			editCabin(
				{ newCabinData: { ...data, image: imageToUse }, id: editId },
				{
					onSuccess: () => {
						reset()
						onCloseModal?.()
					},
				}
			)
		} else {
			createCabin(
				{ ...data, image: image },
				{
					onSuccess: () => {
						reset()
						onCloseModal?.()
					},
				}
			)
		}
	}

	function onError(errors) {
		console.log('Form validation errors:', errors)
	}

	// Function to get image preview URL
	function getImagePreview() {
		// Check if new file is selected
		if (
			watchedImage &&
			watchedImage.length > 0 &&
			watchedImage[0] instanceof File
		) {
			try {
				return URL.createObjectURL(watchedImage[0])
			} catch (error) {
				console.error('Error creating object URL:', error)
				return null
			}
		}
		// Show existing image during edit
		else if (isEditSession && editValues.image) {
			return editValues.image
		}
		return null
	}

	const imagePreview = getImagePreview()

	return (
		<Form
			onSubmit={handleSubmit(onSubmit, onError)}
			type={onCloseModal ? 'modal' : 'regular'}
		>
			<FormRow label='Cabin name' error={errors?.name?.message}>
				<Input
					type='text'
					id='name'
					disabled={isWorking}
					{...register('name', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
				<Input
					type='number'
					id='maxCapacity'
					disabled={isWorking}
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
					disabled={isWorking}
					{...register('regularPrice', {
						required: 'This field is required',
						min: {
							value: 1,
							message: 'Price should be at least 1',
						},
					})}
				/>
			</FormRow>

			<FormRow label='Discount' error={errors?.discount?.message}>
				<Input
					type='number'
					id='discount'
					disabled={isWorking}
					defaultValue={0}
					{...register('discount', {
						required: 'This field is required',
						validate: (value) =>
							Number(value) <= Number(getValues().regularPrice) ||
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
					disabled={isWorking}
					defaultValue=''
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
					disabled={isWorking}
					{...register('image', {
						required: isEditSession ? false : 'This field is required',
					})}
				/>

				{imagePreview && (
					<div style={{ marginTop: '10px' }}>
						<img
							src={imagePreview}
							alt='Cabin preview'
							style={{
								width: '200px',
								height: '150px',
								objectFit: 'cover',
								borderRadius: '8px',
								border: '1px solid var(--color-grey-300)',
							}}
						/>
						{isEditSession && !(watchedImage && watchedImage.length > 0) && (
							<p
								style={{
									fontSize: '12px',
									color: 'var(--color-grey-500)',
									marginTop: '5px',
									fontStyle: 'italic',
								}}
							>
								Current image • Select a new file to change
							</p>
						)}
					</div>
				)}
			</FormRow>

			<FormRow>
				<Button
					type='reset'
					onClick={onCloseModal}
					$variation='secondary'
					disabled={isWorking}
				>
					Cancel
				</Button>

				<Button disabled={isWorking}>
					{isEditSession ? 'Edit Cabin' : 'Create new cabin'}
				</Button>
			</FormRow>
		</Form>
	)
}

CreateCabinForm.propTypes = {
	cabinToEdit: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		maxCapacity: PropTypes.number,
		regularPrice: PropTypes.number,
		discount: PropTypes.number,
		description: PropTypes.string,
		image: PropTypes.string,
	}),
	onCloseModal: PropTypes.func,
}

export default CreateCabinForm
