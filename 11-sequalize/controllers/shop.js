const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = async (req, res, next) => {
	try {
		const response = await Product.fetchAll()
		if (response) {
			const [products] = response
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			})
		}
	} catch (error) {
		console.log(error)
	}
}

exports.getProduct = async (req, res, next) => {
	const { productId } = req.params
	try {
		const response = await Product.findById(productId)
		if (response) {
			const [product] = response
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product[0].title,
				path: '/products',
			})
		}
	} catch (error) {
		console.log(error)
	}
}

exports.getIndex = async (req, res, next) => {
	try {
		const result = await Product.fetchAll()
		if (result) {
			const [products, fieldData] = result
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			})
		}
	} catch (error) {
		console.log(error)
	}
}

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = []
			for (const product of products) {
				const cartProductData = cart.products.find((p) => p.id === product.id)
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						qty: cartProductData.qty,
					})
				}
			}
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts,
			})
		})
	})
}

exports.postCart = (req, res, next) => {
	const { productId } = req.body
	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price)
	})
	res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	})
}

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	})
}

exports.postCartDeleteProduct = (req, res, next) => {
	const { productId } = req.body
	Product.findById(productId, (product) => {
		Cart.deleteProduct(productId, product.price)
		res.redirect('/cart')
	})
}
