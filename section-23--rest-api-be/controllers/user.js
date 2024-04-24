const User = require('../models/user')

exports.getStatus = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)

		if (!user) {
			const error = new Error('User is not found.')
			error.statusCode = 404
			throw error
		}

		res.status(200).json({
			message: 'Success retrive user status.',
			status: user.status,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.updateStatus = async (req, res, next) => {
	const { status } = req.body

	try {
		const user = await User.findById(req.userId)

		if (!user) {
			const error = new Error('User is not found.')
			error.statusCode = 404
			throw error
		}

		user.status = status

		const savedUser = await user.save()

		if (!savedUser) {
			const error = new Error('Failed to save user.')
			error.statusCode = 500
			throw error
		}

		res.status(201).json({
			message: 'Success to update user status.',
			status: savedUser.status,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}
