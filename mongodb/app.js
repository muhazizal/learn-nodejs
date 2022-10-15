const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// const adminRoutes = require('./routes/admin')
// const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(1)
		if (user) {
			req.user = user
			next()
		}
	} catch (error) {
		console.log(error)
	}
})

// app.use('/admin', adminRoutes)
// app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect((client) => {
	console.log(client)
	app.listen(3000)
})
