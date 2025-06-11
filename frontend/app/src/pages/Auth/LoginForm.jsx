import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import AuthInput from '../../components/input/Authinput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContext'
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('enter your password')
  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError('enter a valid email')
      return
    }
    if (!password) {
      setError('passwords')
      return
    }
    setError('');
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token)
        updateUser(user)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('an error occured')
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          please login to your account to continue
        </p>
        <form onSubmit={handleLogin}>
          <AuthInput
            value={email}
            onChange={({ target }) => { setEmail(target.value) }}
            label='Email address'
            type='text'
            placeholder='Enter your email'
          />
          <AuthInput
            value={password}
            onChange={({ target }) => { setPassword(target.value) }}
            label='password'
            type='password'
            placeholder='min 8 characters'
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>LOGIN</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Dont't have an account?{' '}
            <Link className='font-medium text-primary underline' to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LoginForm