import supabase, { supabaseUrl } from './supabase'

export async function signup({ fullName, email, password }) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				fullName,
				avatar: '',
			},
		},
	})

	if (error) throw new Error(error.message)

	return data
}

export async function login({ email, password }) {
	const { data, error } = await supabase.auth.signInWithPassword({
		// Fixed: was singInWith
		email,
		password,
	})

	if (error) throw new Error(error.message)
	return data
}

export async function getCurrentUser() {
	const { data: session } = await supabase.auth.getSession()
	if (!session.session) return null

	const { data, error } = await supabase.auth.getUser()
	if (error) throw new Error(error.message)
	return data?.user
}

export async function logout() {
	const { error } = await supabase.auth.signOut()
	if (error) throw new Error(error.message)
}

export async function updateCurrentUser({ password, fullName, avatar }) {
	// 1. Get current user data first (to access old avatar)
	const { data: currentUser } = await supabase.auth.getUser()
	if (!currentUser?.user) throw new Error('No user found')

	// 2. Update password OR user data (not both at once)
	let updateData = {}
	if (password) {
		updateData = { password }
	}
	if (fullName) {
		updateData = { data: { fullName } }
	}

	// 3. First update user data
	const { data, error } = await supabase.auth.updateUser(updateData)
	if (error) throw new Error(error.message)

	// 4. If no avatar, return early
	if (!avatar) return data

	// 5. Delete old avatar if it exists
	const oldAvatarUrl = currentUser.user.user_metadata?.avatar
	if (oldAvatarUrl) {
		// Extract filename from old avatar URL
		const oldFileName = oldAvatarUrl.split('/').pop()
		if (oldFileName && oldFileName.startsWith('avatar-')) {
			await supabase.storage.from('avatars').remove([oldFileName])
		}
	}

	// 6. Upload new avatar to storage
	const fileName = `avatar-${data.user.id}-${Date.now()}`

	const { error: storageError } = await supabase.storage
		.from('avatars')
		.upload(fileName, avatar)

	if (storageError) throw new Error(storageError.message)

	// 7. Update user with new avatar URL
	const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`

	const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
		data: {
			fullName,
			avatar: avatarUrl,
		},
	})

	if (error2) throw new Error(error2.message)
	return updatedUser
}
