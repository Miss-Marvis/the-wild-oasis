// import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '../../ui/Button'
import Tag from '../../ui/Tag'
import Flag from '../../ui/Flag'

const StyledTodayItem = styled.li`
	display: grid;
	grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
	gap: 1.2rem;
	align-items: center;
	font-size: 1.4rem;
	padding: 0.8rem 0;
	border-bottom: 1px solid var(--color-grey-100);

	&:first-child {
		border-top: 1px solid var(--color-grey-100);
	}

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: var(--color-grey-50);
	}
`

const Guest = styled.div`
	font-weight: 500;
	color: var(--color-grey-700);
`

const NightsText = styled.div`
	color: var(--color-grey-600);
	text-align: right;
`

const TagContainer = styled.div`
	display: flex;
	justify-content: flex-start;
`

const FlagContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`

export default function TodayItem({ activity }) {
	const { id, status, guests, numNights, activityType } = activity

	// Determine what to show based on activity type and status
	const getDisplayInfo = () => {
		if (activityType === 'departing' && status === 'unconfirmed') {
			return {
				tag: { type: 'green', text: 'Arriving' },
				button: {
					type: 'primary',
					text: 'Check in',
					link: `/checkin/${id}`,
				},
			}
		}

		switch (activityType) {
			case 'arriving':
				if (status === 'unconfirmed') {
					return {
						tag: { type: 'green', text: 'Arriving' },
						button: {
							type: 'primary',
							text: 'Check in',
							link: `/checkin/${id}`,
						},
					}
				} else if (status === 'checked-in') {
					return {
						tag: { type: 'green', text: 'Checked in today' },
						button: null,
					}
				}
				break

			case 'departing':
				if (status === 'checked-in') {
					return {
						tag: { type: 'blue', text: 'Departing' },
						button: {
							type: 'secondary',
							text: 'Check out',
							action: () => handleCheckOut(id),
						},
					}
				} else if (status === 'checked-out') {
					return {
						tag: { type: 'silver', text: 'Checked out today' },
						button: null,
					}
				}
				break

			case 'arriving-departing':
				// Same day arrival and departure (day trip)
				if (status === 'unconfirmed') {
					return {
						tag: { type: 'green', text: 'Day trip - Arriving' },
						button: {
							type: 'primary',
							text: 'Check in',
							link: `/checkin/${id}`,
						},
					}
				} else if (status === 'checked-in') {
					return {
						tag: { type: 'blue', text: 'Day trip - Departing' },
						button: {
							type: 'secondary',
							text: 'Check out',
							action: () => handleCheckOut(id),
						},
					}
				} else if (status === 'checked-out') {
					return {
						tag: { type: 'silver', text: 'Day trip - Completed' },
						button: null,
					}
				}
				break

			default:
				console.warn(`Unknown activity type: ${activityType} for booking ${id}`)
				return {
					tag: { type: 'silver', text: 'Activity' },
					button: null,
				}
		}

		// Fallback for unexpected status combinations
		console.warn(
			`Unexpected status "${status}" for activity type "${activityType}" in booking ${id}`
		)
		return {
			tag: { type: 'silver', text: `${activityType} - ${status}` },
			button: null,
		}
	}

	const handleCheckOut = (bookingId) => {
		console.log(`Checking out booking ${bookingId}`)
		// Add your check out logic here
	}

	const displayInfo = getDisplayInfo()

	return (
		<StyledTodayItem>
			<TagContainer>
				{displayInfo.tag && (
					<Tag type={displayInfo.tag.type}>{displayInfo.tag.text}</Tag>
				)}
			</TagContainer>

			<FlagContainer>
				<Flag
					countryFlag={guests?.countryFlag || '🌍'}
					alt={`Flag of ${guests?.country || 'Unknown'}`}
				/>
			</FlagContainer>

			<Guest>{guests?.fullName || 'Unknown Guest'}</Guest>

			<NightsText>
				{numNights} {numNights === 1 ? 'night' : 'nights'}
			</NightsText>

			<ButtonContainer>
				{displayInfo.button &&
					(displayInfo.button.link ? (
						<Button
							size='small'
							variation={displayInfo.button.type}
							as={Link}
							to={displayInfo.button.link}
						>
							{displayInfo.button.text}
						</Button>
					) : (
						<Button
							size='small'
							variation={displayInfo.button.type}
							onClick={displayInfo.button.action}
						>
							{displayInfo.button.text}
						</Button>
					))}
			</ButtonContainer>
		</StyledTodayItem>
	)
}

TodayItem.propTypes = {
	activity: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		status: PropTypes.string.isRequired,
		activityType: PropTypes.string.isRequired,
		numNights: PropTypes.number.isRequired,
		guests: PropTypes.shape({
			fullName: PropTypes.string,
			country: PropTypes.string,
			countryFlag: PropTypes.string,
		}),
	}).isRequired,
}
