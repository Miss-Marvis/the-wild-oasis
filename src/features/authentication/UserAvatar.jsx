import styled from 'styled-components'
import { useUser } from '../../features/authentication/useUser'

const StyledUserAvatar = styled.div`
	display: flex;
	gap: 1.2rem;
	align-items: center;
	font-weight: 500;
	font-size: 1.4rem;
	color: var(--color-grey-600);
`

const Avatar = styled.img`
	display: block;
	width: 3.6rem;
	aspect-ratio: 1;
	object-fit: cover;
	object-position: center;
	border-radius: 50%;
	outline: 2px solid var(--color-grey-100);
`

export default function UserAvatar() {
	const { user } = useUser()

	if (!user || !user.user_metadata) {
		return <div>Loading user...</div>
	}

	const fullName =
		user.user_metadata.fullName || user.email?.split('@')[0] || 'User'
	const avatar = user.user_metadata.avatar || 'default-avatar.jpg'

	// Debug the extracted values
	console.log('Extracted fullName:', fullName)
	console.log('Extracted avatar:', avatar)

	return (
		<StyledUserAvatar>
			<Avatar
				src={avatar}
				alt={`Avatar of ${fullName}`}
				onError={(e) => {
					console.log('Avatar failed to load:', e.target.src)
					e.target.src = 'default-avatar.jpg'
				}}
			/>
			<span>{fullName}</span>
		</StyledUserAvatar>
	)
}
