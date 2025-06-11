import React, { useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector'
import AuthInput from '../../components/input/Authinput'
import { validateEmail } from '../../utils/helper'
import uploadImage from '../../utils/uploadImage'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useContext } from 'react'
const SignUpForm = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault()
    let profileImageUrl = ""
    if (!fullName) {
      setError('full name ')
      return
    }
    if (!validateEmail(email)) {
      setError('enter a valid email')
      return
    }
    if (!username) {
      setError('username ')
      return
    }
    if (!password) {
      setError('password ')
      return
    }
    setError('')
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || ""
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { fullName, username, email, password, profileImageUrl })
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token)
        updateUser(user)
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('an error occured')
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below. It's quick and easy!
        </p>
        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='gird grid-cols-1 md:grid-cols-2 gap-4'>
            <AuthInput value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label={'Full Name'} type={'text'} placeholder={'Enter your full name'} />
            <AuthInput
              value={email}
              onChange={({ target }) => { setEmail(target.value) }}
              label='Email address'
              type='text'
              placeholder='Enter your email'
            />
            <AuthInput
              value={username}
              onChange={({ target }) => { setUsername(target.value) }}
              label='Username'
              type='text'
              placeholder='@'
            />
            <AuthInput
              value={password}
              onChange={({ target }) => { setPassword(target.value) }}
              label='password'
              type='password'
              placeholder='min 8 characters'
            />
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>CREATE ACCOUNT</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Aleady have an account?{' '}
            <Link className='font-medium text-primary underline' to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUpForm