import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = (props) => {
  const navigate = useNavigate()
  const [txt, setTxt] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    walletAddress: '',
  })

  const { username, email, password, walletAddress } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
      username,
      email,
      password,
      walletAddress,
    }

    newUser.walletAddress = props.defaultAccount

    const body = JSON.stringify(newUser)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const res = await axios.post(`http://localhost:5000/signup`, body, config)
      if (res.data.status == 400) {
        alert(res.data.msg)
      }

      if (res.data.status != 400) {
        console.log(props.defaultAccount)
        alert('OTP Sent, Check your email')
        navigate(`/verifyOtp/${username}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onInputChange = (e) => {
    const { value } = e.target

    const regex = /^(?:[a-z0-9]+|\d+)$/
    if (value === '' || regex.test(value)) {
      setTxt(value)
    } else {
      alert(
        'Use only lowercase alphabets and numbers, Remove special character'
      )
    }
  }

  return (
    <Fragment>
      <div className='container text-center'>
        <h1 className='large'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              className='my-3'
              type='text'
              placeholder='Username'
              name='username'
              value={username}
              onChange={(e) => {
                onChange(e)
                onInputChange(e)
              }}
            />
            <br />
            <input
              className='my-3'
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
            />
            <br />
            <input
              className='my-3'
              type='password'
              placeholder='Password'
              name='password'
              minLength='8'
              value={password}
              onChange={(e) => onChange(e)}
            />
            <br />
            <input
              className='my-3'
              type='text'
              placeholder='Wallet Address'
              value={props.defaultAccount == null ? '' : props.defaultAccount}
              disabled
            />
            <br />
            <button
              disabled={props.connButtonText === 'connected'}
              className='btn btn-dark'
              onClick={props.connectWalletHandler}
              type='button'
            >
              {props.connButtonText === 'Connect Wallet'
                ? props.connButtonText
                : 'Wallet Connected'}{' '}
            </button>
          </div>
          <br />
          <input
            type='submit'
            className='btn btn-outline-dark'
            value='Register'
          />
        </form>
      </div>
    </Fragment>
  )
}
export default Register
