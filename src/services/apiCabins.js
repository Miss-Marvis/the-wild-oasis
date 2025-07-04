import supabase, { supabaseUrl } from './supabase'

export async function getCabins() {
	const { data, error } = await supabase.from('cabins').select('*')

	if (error) {
		throw new Error('Cabins could not be loaded')
	}
	return data
}

export async function createEditCabin(newCabin, id) {
	const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl)

	const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
		'/',
		''
	)
	const imagePath = hasImagePath
		? newCabin.image
		: `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`

	// CREATE
	let query = supabase.from('cabins')
	if (!id) query = query.insert({ ...newCabin, image: imagePath })

	//EDIT
	if (id) query = query.update([{ ...newCabin, image: imagePath }]).eq('id', id)

	const { data, error } = await query.select().single()

	if (error) {
		throw new Error('Cabin could not be created')
	}

	// upload image
	if (hasImagePath) return data
	const { error: storageError } = await supabase.storage
		.from('cabin-images')
		.upload(imageName, newCabin.image)

	if (storageError) {
		await supabase.from('cabins').delete().eq('id', data[0].id)
		throw new Error(
			'Cabin image could not be uploaded and the cabin was not created'
		)
	}

	return data
}

export async function deleteCabin(id) {
	const { error } = await supabase.from('cabins').delete().eq('id', id)

	if (error) {
		throw new Error('Cabin could not be deleted')
	}

	return id
}
