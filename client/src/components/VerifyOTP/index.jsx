import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [formData, setFormData] = useState({
    username: params.username,
    otp: '',
  })

  const { username, otp } = formData
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
      username,
      otp,
    }
    const body = JSON.stringify(newUser)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/signup/verifyOTP`,
        body,
        config
      )
      alert(res.data.msg)
      if (res.data.msg == 'Email verified') {
        navigate('/home')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
      <div className='container text-center'>
        <h1 className='large'>Verify OTP</h1>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              className='my-3'
              type='text'
              placeholder='574168'
              name='otp'
              value={otp}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input
            type='submit'
            className='btn btn-outline-dark'
            value='Submit OTP'
          />
        </form>
      </div>
    </Fragment>
  )
}
export default VerifyOTP
