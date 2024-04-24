const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const User = require('../models/user')

const authController = require('../controllers/auth')

// SIGN UP user
router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom(async (value, { _req }) => {
				const user = await User.findOne({ email: value })
				if (user) {
					return Promise.reject('E-Mail address already exists!')
				}
			})
			.normalizeEmail(),
		body('password').trim().isLength({ min: 5 }),
		body('name').trim().not().isEmpty(),
	],
	authController.signup
)

// LOGIN user
router.post('/login', authController.login)

module.exports = router
