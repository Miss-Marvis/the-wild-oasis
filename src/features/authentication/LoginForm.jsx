import { useState } from 'react'
import styled from 'styled-components'
import Button from '../ui/Button'
import Form from '../ui/Form'
import Input from '../ui/Input'
import FormRowVertical from '../ui/FormRowVertical'
import SpinnerMini from '../ui/SpinnerMini'
import { useLogin } from './useLogin'

const LoginContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--color-grey-50);
`

const LoginBox = styled.div`
	background-color: var(--color-grey-0);
	border: 1px solid var(--color-grey-100);
	border-radius: var(--border-radius-md);
	padding: 4.8rem;
	box-shadow: var(--shadow-md);
	max-width: 48rem;
	width: 100%;
`

const Logo = styled.div`
	text-align: center;
	margin-bottom: 3.2rem;
	img {
		height: 9.6rem;
		width: auto;
	}
`

const Heading = styled.h4`
	text-align: center;
	margin-bottom: 3.2rem;
	font-size: 3rem;
	font-weight: 600;
	color: var(--color-grey-700);
`

function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, isLoading } = useLogin()

	function handleSubmit(e) {
		e.preventDefault()

		if (!email || !password) {
			return
		}

		login(
			{ email, password },
			{
				onSettled: () => {
					setEmail('')
					setPassword('')
				},
			}
		)
	}

	return (
		<LoginContainer>
			<LoginBox>
				<Logo>
					<img src='/logo.jpg' alt='Logo' />
				</Logo>
				<Heading>Log in to your account</Heading>
				<Form onSubmit={handleSubmit}>
					<FormRowVertical label='Email address'>
						<Input
							type='email'
							id='email'
							autoComplete='username'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							placeholder='Enter your email'
						/>
					</FormRowVertical>
					<FormRowVertical label='Password'>
						<Input
							type='password'
							id='password'
							autoComplete='current-password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							placeholder='Enter your password'
						/>
					</FormRowVertical>
					<FormRowVertical>
						<Button size='large' disabled={isLoading}>
							{!isLoading ? 'Log in' : <SpinnerMini />}
						</Button>
					</FormRowVertical>
				</Form>
			</LoginBox>
		</LoginContainer>
	)
}

export default LoginForm
