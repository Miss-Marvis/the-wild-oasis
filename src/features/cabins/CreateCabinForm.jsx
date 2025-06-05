import Input from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import Button from '../../ui/Button'
import Form from '../../ui/Form'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createCabin } from '../../services/apiCabins'
import FormRow from '../../ui/FormRow'

function CreateCabinForm() {
	const { register, handleSubmit, reset, getValues, formState } = useForm()

	const { errors } = formState
	console.log(errors)

	const queryClient = useQueryClient()

	const { mutate, isLoading: isCreating } = useMutation({
		mutationFn: createCabin,
		onSuccess: () => {
			toast.success('New cabin successfully created')
			queryClient.invalidateQueries({ queryKey: ['cabins'] })
			reset()
		},
		onError: (err) => toast.error(err.message),
	})

	function onSubmit(data) {
		mutate({ ...data, image: data.image[0] })
	}

	function onError(error) {
		console.log(error)
	}

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

			<FormRow label='maxCapacity' error={errors?.maxCapacity?.message}>
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
			<FormRow label='regularPrice' error={errors?.regularPrice?.message}>
				<Input
					type='number'
					id='regularPrice'
					disabled={isCreating}
					{...register('regularPrice', { required: 'This field is required' })}
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
					defaultValue=''
					{...register('description', { required: 'This field is required' })}
				/>
			</FormRow>

			<FormRow label='Cabin photo' error={errors?.image?.message}>
				<Input
					type='file'
					id='image'
					accept='image/*'
					{...register('image', { required: 'This field is required' })}
				/>
			</FormRow>

			<FormRow>
				<Button variation='secondary' type='button'>
					Cancel
				</Button>

				<Button disabled={isCreating}>Add cabin</Button>
			</FormRow>
		</Form>
	)
}

export default CreateCabinForm
