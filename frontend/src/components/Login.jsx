import { useForm } from "react-hook-form"
import { Input, Button } from '../index'
import { Link } from "react-router-dom";
import Wrapper from './Wrapper';
import { SignIn, SignInWithGoogle } from "../api/authentication/authApi";
import { useNavigate } from 'react-router-dom'
import userData from "../zustand/userData";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const setCurrentUserData = userData((state) => state.setCurrentUserData)

  async function InputValues(data) {
    const responseData = await SignIn(data)
    if (responseData.status === 200) {
      // setCurrentUserData(responseData.data.data.user)
      setCurrentUserData({data: responseData.data.data.user, loading: false, isUser: Boolean(responseData.data.data.user),notUser: false})
      navigate("/")
    }
  }

  async function googleLogin(e) {
    // // console.log(e.credential)
    const response = await SignInWithGoogle(e.credential)
    // console.log('response',response)
    if (response.status === 200) {
      setCurrentUserData({data: response.data.data.user, loading: false, isUser: Boolean(response.data.data.user),notUser: false})
      navigate("/")
    }
  }

  return (
    <>
      <Wrapper>
        <div className='flex flex-col items-center justify-center'>
          <form className="flex flex-col gap-4 px-7 py-6 bg-[#250e29] rounded-md w-full max-w-md" onSubmit={handleSubmit(InputValues)}>

            <h1 className='text-white text-[1.3rem]'>Login</h1>
            <hr />
            <GoogleLogin onSuccess={googleLogin} className="flex items-center gap-3 bg-white px-4 py-2 rounded-full cursor-pointer">
            </GoogleLogin>
            <p className="text-center">Or</p>
            <Input
              id="email"
              type="email"
              className="bg-transparent h-10 px-3 w-full text-[1.1rem] outline-none border-white border-[1.5px] text-white rounded-sm"
              label="Email"
              labelClass="text-white"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />

            <Input
              id="password"
              type="password"
              className="bg-transparent h-10 px-3 w-full text-[1.1rem] outline-none border-white border-[1.5px] text-white rounded-sm"
              label="Password"
              labelClass="text-white"
              placeholder="Enter your password"
              {...register("password")}
            />

            <Button type="submit" buttonTxt="Submit" className="bg-white text-black rounded-sm mt-2 py-2 w-full" />

            <p className='text-white text-center'>Does not have an account?
              <Link className='text-[#4f5bff] ml-2' to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </Wrapper>
    </>
  )
}

export default Login
