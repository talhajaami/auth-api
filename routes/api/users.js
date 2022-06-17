const express = require('express')
const { check, validationResult } = require('express-validator');
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/Users')
const OTPVerificaton = require('../../models/OTPVerificaton')
const sendEmail = require('../../utils/sendEmail')
const jwt = require('jsonwebtoken')
const ethers = require('ethers')

require('dotenv').config()

router.post('/',
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a min 8 digit password'
    ).isLength({ min: 8 }),
    check('walletAddress', 'Wallet Address is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, email, password, walletAddress } = req.body;

        let result = ethers.utils.isAddress(walletAddress)

        if (!result) {
            res.json({ "status": 400, "msg": 'Invalid Wallet Address' })
        } else {
            function onlyAlphabetsNumbers(username) {
                return /^(?:[a-z0-9]+|\d+)$/.test(username);
            }

            try {
                // check already exists email and password
                let user = await User.findOne({ email })
                let checkUsername = await User.findOne({ username })
                if (user) {
                    res.json({ "status": 400, "msg": 'Email already exists' })
                } else if (checkUsername) {
                    res.json({ "status": 400, "msg": 'Username already exists' })
                } else {
                    user = await new User({
                        username,
                        email,
                        password,
                        walletAddress
                    })

                    // encrypt password
                    const salt = await bcrypt.genSalt(10)
                    user.password = await bcrypt.hash(password, salt)

                    // save users Signup credentials in database
                    await user.save()

                    // generate OTP
                    function generateOTP() {
                        let otp = ''
                        for (let i = 0; i <= 5; i++) {
                            const randValue = Math.round(Math.random() * 9)
                            otp = otp + randValue
                        }
                        return otp
                    }
                    let OTP = generateOTP()


                    let result = onlyAlphabetsNumbers(username)
                    if (result) {
                        res.json({ "status": 200, "msg": 'Valid input' })
                    } else {
                        res.json({ "status": 400, "msg": 'inValid input: No special characters allowed' })
                    }
                    // save otp in database against userID
                    await new OTPVerificaton({
                        owner: user._id,
                        otp: OTP
                    }).save()

                    // calling the function to send an email
                    await sendEmail(user.email, OTP)

                    // jwt token
                    const payload = {
                        user: {
                            id: user.id
                        }
                    };

                    jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            throw err
                        } else {
                            res.json(token)
                        }
                    });
                }

            } catch (error) {
                console.error(error.message)
                return res.status(500).send('Server Error')
            }
        }

    })


router.post('/verifyOTP', async (req, res) => {

    const { username, otp } = req.body

    // get data from database w.e.f username
    let user = await User.findOne({ username: username })
    user = user.id      // get user id 
    if (!user) {
        res.json({ "status": 400, "msg": 'User not Found' })
    }

    // check if user is already verified of not
    if (user.isVerified) {
        res.json({ "status": 400, "msg": 'Already verified' })
    }

    // get user from OTP database
    const OTP = await OTPVerificaton.findOne({ owner: user })
    if (!OTP.owner) {
        console.log("User not found")
        res.json({ "status": 400, "msg": 'User not Found' })
    }

    // verify otp
    if (otp == OTP.otp) {
        await User.findOneAndUpdate({ _id: user }, { isVerified: true })
        await OTPVerificaton.deleteOne({ owner: user })
        res.json({ "status": 200, "msg": 'Email verified' })
    } else {
        res.json({ "status": 400, "msg": 'OTP is incorrect' })
    }
})

module.exports = router