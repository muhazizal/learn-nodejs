const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cartItem')
const Order = require('./models/order')
const OrderItem = require('./models/orderItem')

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

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

Product.belongsTo(User, {
	constraints: true,
	onDelete: 'cascade',
})
User.hasMany(Product)

Cart.belongsTo(User)
User.hasOne(Cart)

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

sequelize
	// .sync({ force: true })
	.sync()
	.then((_result) => {
		return User.findByPk(1)
	})
	.then((user) => {
		if (!user) {
			return User.create({ name: 'Aziz', email: 'aziz@gmail.com' })
		}
		return user
	})
	.then((user) => {
		return user.createCart()
	})
	.then((_cart) => {
		app.listen(3001)
	})
	.catch((error) => {
		console.log('sequelize sync error', error)
	})
