const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const feedController = require('../controllers/feed')

const isAuth = require('../middleware/is-auth')

// GET all posts
router.get('/posts', isAuth, feedController.getPosts)

// CREATE post
router.post(
	'/post',
	isAuth,
	[body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
	feedController.createPost
)

// GET post by id
router.get('/post/:postId', isAuth, feedController.getPost)

// UPDATE post
router.put(
	'/post/:postId',
	isAuth,
	[body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 })],
	feedController.updatePost
)

// DELETE post
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router
