import { useState } from 'react'
import styled from 'styled-components'
import Button from '../ui/Button'
import Form from '../ui/Form'
import Input from '../ui/Input'
// import FormRowVertical from '../ui/FormRowVertical'
import SpinnerMini from '../ui/SpinnerMini'
import { useLogin } from '../features/authentication/useLogin'

const LoginContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f9fafb;
	padding: 2rem;
`

const LoginBox = styled.div`
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 4rem 3rem;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	max-width: 400px;
	width: 100%;
`

const LogoContainer = styled.div`
	text-align: center;
	margin-bottom: 2rem;
`

const Logo = styled.div`
	text-align: center;
	margin-bottom: 3.2rem;
	img {
		height: 9.6rem;
		width: auto;
	}
`
const BrandText = styled.div`
	font-size: 11px;
	font-weight: 600;
	color: #6b7280;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	margin-bottom: 0.5rem;
`

const Heading = styled.h2`
	text-align: center;
	margin-bottom: 2rem;
	font-size: 2rem;
	font-weight: 600;
	color: #111827;
`
const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`
const Label = styled.label`
	font-size: 1.6rem;
	font-weight: 500;
	color: #374151;
	margin-bottom: 0.5rem;
`

function Login() {
	const [email, setEmail] = useState('jonas@example.com')
	const [password, setPassword] = useState('pass0987')
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
				<LogoContainer>
					<Logo />
					<BrandText>THE WILD OASIS</BrandText>
				</LogoContainer>
				<Heading>Log in to your account</Heading>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label htmlFor='email'>Email address</Label>
						<Input
							type='email'
							id='email'
							autoComplete='username'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							placeholder='cogir93701@finfave.com'
						/>
					</FormGroup>
					<FormGroup Label='Password'>
						<Label htmlFor='password'>Password</Label>
						<Input
							type='password'
							id='password'
							autoComplete='current-password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							placeholder='zxcvbnm'
						/>
					</FormGroup>
					<FormGroup>
						<Button size='large' disabled={isLoading}>
							{!isLoading ? 'Log in' : <SpinnerMini />}
						</Button>
					</FormGroup>
				</Form>
			</LoginBox>
		</LoginContainer>
	)
}
export default Login
