const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const isAuth = require('../middleware/is-auth')

const userController = require('../controllers/user')

// GET user status
router.get('/status', isAuth, userController.getStatus)

// UPDATE user status
router.patch(
	'/status',
	isAuth,
	[body('status').trim().not().isEmpty()],
	userController.updateStatus
)

module.exports = router
