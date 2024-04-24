const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signup = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const error = new Error('Validation Failed.')
		error.statusCode = 422
		error.data = errors.array()
		next(error)
	}

	const { email, password, name } = req.body

	try {
		const hashedPassword = await bcrypt.hash(password, 12)

		const user = new User({
			email,
			password: hashedPassword,
			name,
			status: 'new',
		})

		const result = await user.save()

		if (!result) {
			const error = new Error('Failed to create user.')
			error.statusCode = 500
			throw error
		}

		res.status(201).json({
			message: 'User created.',
			userId: result._id,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.login = async (req, res, next) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })

		if (!user) {
			const error = new Error('A user with this email could not be found.')
			error.statusCode = 401
			throw error
		}

		const isPasswordEqual = await bcrypt.compare(password, user.password)

		if (!isPasswordEqual) {
			const error = new Error('Wrong password.')
			error.statusCode = 401
			throw error
		}

		const token = jwt.sign(
			{
				email: user.email,
				password: user.password,
				userId: user._id,
			},
			'secretkey',
			{ expiresIn: '1h' }
		)

		res.status(200).json({
			message: 'Login success.',
			token,
			userId: user._id,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}
