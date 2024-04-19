exports.getPosts = (req, res, next) => {
	res.status(200).json({
		data: [{ title: 'First Post', content: 'This is my first post' }],
		message: 'Success',
	})
}

exports.createPost = (req, res, next) => {
	const { title, content } = req.body

	res.status(201).json({
		data: [{ id: new Date().toISOString(), title, content }],
		message: 'Success Create Post',
	})
}
