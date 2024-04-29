const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const http = require('http')
const socket = require('./socket')

// RUOTES
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()

// File storage
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname)
	},
})

// File Filter
const fileFilter = (req, file, cb) => {
	const { mimetype } = file
	if (['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

// Use Multer
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))

// Parse body request json
app.use(bodyParser.json())

// Serve images
app.use('/images', express.static(path.join(__dirname, 'images')))

// Set headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})

// Use ROUTES
app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

// Error handling
app.use((error, req, res, next) => {
	console.log('Error Middleware: ', error)
	const status = error.statusCode || 500
	const message = error.message
	const data = error.data
	res.status(status).json({ message, data })
})

// Connect database
mongoose
	.connect(
		'mongodb+srv://test:muhazizal@main.q93mkgc.mongodb.net/?retryWrites=true&w=majority&appName=main'
	)
	.then(async (res) => {
		console.log('Database Connected!')

		// Server
		const server = http.createServer(app)

		// Web Socket
		const io = socket.init(server)

		io.on('connection', () => console.log('Socket Connected!'))

		server.listen(8080, () => console.log('Server listening on port: 8080'))
	})
	.catch((error) => {
		console.log('app.js Error: ', error)
	})
