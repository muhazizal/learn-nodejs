const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')

const Post = require('../models/post')
const User = require('../models/user')

exports.getPosts = async (req, res, next) => {
	const currentPage = req.query.page || 1
	const perPage = 2
	let totalItems = 0

	try {
		totalItems = await Post.find().countDocuments()

		const posts = await Post.find()
			.skip((currentPage - 1) * perPage)
			.limit(perPage)

		res.status(200).json({
			message: 'Fetched posts successfully.',
			posts,
			totalItems,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.createPost = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.')
		error.statusCode = 422
		next(error)
	}
	if (!req.file) {
		const error = new Error('No image provided.')
		error.statusCode = 422
		next(error)
	}

	const { title, content } = req.body
	const imageUrl = req.file.path

	const post = new Post({
		content,
		creator: req.userId,
		imageUrl,
		title,
	})

	try {
		const savedPost = await post.save()

		if (!savedPost) {
			const error = new Error('Failed to save post.')
			error.statusCode = 500
			throw error
		}

		const user = await User.findById(req.userId)

		if (!user) {
			const error = new Error('User is not exist.')
			error.statusCode = 401
			throw error
		}

		user.posts.push(post)

		const savedUser = await user.save()

		if (!savedUser) {
			const error = new Error('Failed to save user.')
			error.statusCode = 500
			throw error
		}

		res.status(201).json({
			message: 'Success Create Post',
			post: post,
			creator: { id: user._id, name: user.name },
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.getPost = async (req, res, next) => {
	const { postId } = req.params

	try {
		const post = await Post.findById(postId)

		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			throw error
		}

		res.status(200).json({
			message: 'Post fetched.',
			post,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.updatePost = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.')
		error.statusCode = 422
		next(error)
	}

	const { postId } = req.params
	const { title, content } = req.body
	let imageUrl = req.body.image

	if (req.file) {
		imageUrl = req.file.path
	}

	if (!imageUrl) {
		const error = new Error('No file picked.')
		error.statusCode = 422
		next(error)
	}

	try {
		const post = await Post.findById(postId)

		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			throw error
		}

		if (post.creator.toString() !== req.userId) {
			const error = new Error('Not authorized.')
			error.statusCode = 403
			throw error
		}

		if (!imageUrl !== post.imageUrl) {
			clearImage(post.imageUrl)
		}

		post.title = title
		post.content = content
		post.imageUrl = imageUrl

		const updatedPost = await post.save()

		if (!updatedPost) {
			const error = new Error('Failed to update post.')
			error.statusCode = 500
			throw error
		}

		res.status(200).json({
			message: 'Post updated!',
			post: updatedPost,
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.deletePost = async (req, res, next) => {
	const { postId } = req.params

	try {
		const post = await Post.findById(postId)

		if (!post) {
			const error = new Error('Could not find post.')
			error.statusCode = 404
			throw error
		}

		if (post.creator.toString() !== req.userId) {
			const error = new Error('Not authorized.')
			error.statusCode = 403
			throw error
		}

		clearImage(post.imageUrl)

		const deletedPost = await Post.findByIdAndDelete(postId)

		if (!deletedPost) {
			const error = new Error('Failed to delete post.')
			error.statusCode = 500
			throw error
		}

		const user = await User.findById(req.userId)

		if (!user) {
			const error = new Error('User is not found.')
			error.statusCode = 404
			throw error
		}

		user.posts.pull(postId)

		const updatedUser = await user.save()

		if (!updatedUser) {
			const error = new Error('Failed to update user.')
			error.statusCode = 500
			throw error
		}

		res.status(200).json({
			message: 'Deleted post.',
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath)
	fs.unlink(filePath, (error) => console.log(error))
}
