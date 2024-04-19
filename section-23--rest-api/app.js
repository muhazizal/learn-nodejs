const express = require('express')
const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed')

const app = express()

// app.use(bodyParser.urlencoded()) // form data
app.use(bodyParser.json()) // json

app.use((req, res, next) => {
	req.headers['Access-Control-Allow-Origin'] = '*'
	req.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE'
	req.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
	next()
})

app.use('/feed', feedRoutes)

app.listen(8080)
