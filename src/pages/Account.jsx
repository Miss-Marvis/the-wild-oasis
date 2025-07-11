// import React from 'react'

import UpdatePasswordForm from '../features/authentication/UpdatePasswordForm'
import UpdateUserDataForm from '../features/authentication/UpdateUserDataForm'
import Heading from '../ui/Heading'
import Row from '../ui/Row'

export default function Account() {
	return (
		<>
			<Heading as='h1'>Update your account</Heading>

			<Row>
				<Heading as='h3'>Update user data</Heading>
				<UpdateUserDataForm />
			</Row>

			<Row>
				<Heading as='h3'>update password</Heading>
				<UpdatePasswordForm />
			</Row>
		</>
	)
}
