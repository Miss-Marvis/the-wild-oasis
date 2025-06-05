import supabase, { supabaseUrl } from './supabase'

// =================== GET CABINS ===================
export async function getCabins() {
	const { data, error } = await supabase.from('cabins').select('*')
	if (error) {
		throw new Error('Cabins could not be loaded')
	}
	return data
}

// =================== CREATE CABIN ===================
export async function createCabin(newCabin) {
	// 1. Create unique image name
	const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
		'/',
		''
	)
	// 2. Create public image path (for database)
	const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`

	// 3. Insert cabin into DB (with image path, not actual file yet)
	const { data, error } = await supabase
		.from('cabins')
		.insert([{ ...newCabin, image: imagePath }])
		.select()

	if (error) {
		throw new Error('Cabin could not be created')
	}

	// 4. Upload the image file to Supabase Storage
	const { error: storageError } = await supabase.storage
		.from('cabin-images')
		.upload(imageName, newCabin.image)

	// 5. If image upload fails, delete the created cabin to stay in sync
	if (storageError) {
		await supabase.from('cabins').delete().eq('id', data[0].id)
		throw new Error(
			'Cabin image could not be uploaded. Cabin creation rolled back.'
		)
	}

	return data
}

// =================== UPDATE CABIN ===================
export async function updateCabin({ id, cabin }) {
	let cabinData = { ...cabin }

	// Check if there's a new image to upload
	const hasNewImage = cabin.image && typeof cabin.image === 'object'

	if (hasNewImage) {
		// 1. Create unique image name
		const imageName = `${Math.random()}-${cabin.image.name}`.replaceAll('/', '')

		// 2. Create public image path
		const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`

		// 3. Upload the new image file to Supabase Storage
		const { error: storageError } = await supabase.storage
			.from('cabin-images')
			.upload(imageName, cabin.image)

		if (storageError) {
			throw new Error('New cabin image could not be uploaded')
		}

		// 4. Update cabin data with new image path
		cabinData = { ...cabin, image: imagePath }
	}

	// 5. Update cabin in database
	const { data, error } = await supabase
		.from('cabins')
		.update(cabinData)
		.eq('id', id)
		.select()

	if (error) {
		throw new Error('Cabin could not be updated')
	}

	return data
}

// =================== DELETE CABIN ===================
export async function deleteCabin(id) {
	const { error } = await supabase.from('cabins').delete().eq('id', id)

	if (error) {
		throw new Error('Cabin could not be deleted')
	}

	return id
}
