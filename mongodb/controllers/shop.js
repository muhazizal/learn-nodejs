const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.findAll()
		if (products) {
			console.log('getIndex response', products)
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			})
		}
	} catch (error) {
		console.log('getIndex error', error)
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const response = await Product.findAll()
		if (response) {
			console.log('getProducts response', response)
			res.render('shop/product-list', {
				prods: response,
				pageTitle: 'All Products',
				path: '/products',
			})
		}
	} catch (error) {
		console.log('getProducts error', error)
	}
}

exports.getProduct = async (req, res, next) => {
	const { productId } = req.params
	try {
		const product = await Product.findByPk(productId)
		if (product) {
			console.log('getProduct response', product)
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			})
		}
	} catch (error) {
		console.log(error)
	}
}

exports.getCart = async (req, res, next) => {
	try {
		const cart = await req.user.getCart()
		if (cart) {
			const products = await cart.getProducts()
			if (products) {
				res.render('shop/cart', {
					path: '/cart',
					pageTitle: 'Your Cart',
					products: products,
				})
			}
		}
	} catch (error) {
		console.log(error)
	}
}

exports.postCart = async (req, res, next) => {
	const { productId } = req.body
	try {
		const cart = await req.user.getCart()
		if (cart) {
			const cartProducts = await cart.getProducts({ where: { id: productId } })
			const cartProduct = cartProducts[0]
			let quantity = 1
			if (cartProduct) {
				const cartItemQty = cartProduct.cartItem.quantity
				quantity = cartItemQty + 1
			}
			const product = await Product.findByPk(productId)
			if (product) {
				const addedProduct = await cart.addProduct(product, {
					through: {
						quantity: quantity,
					},
				})
				if (addedProduct) {
					res.redirect('/cart')
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}

exports.postOrder = async (req, res, next) => {
	try {
		const cart = await req.user.getCart()
		if (cart) {
			const products = await cart.getProducts()
			if (products) {
				const order = await req.user.createOrder()
				if (order) {
					const addedProducts = await order.addProducts(
						products.map((product) => {
							product.orderItem = { quantity: product.cartItem.quantity }
							return product
						})
					)
					if (addedProducts) {
						await cart.setProducts(null)
						res.redirect('/orders')
					}
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await req.user.getOrders({ include: ['products'] })
		if (orders) {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			})
		}
	} catch (error) {
		console.log(error)
	}
}

exports.postCartDeleteProduct = async (req, res, next) => {
	const { productId } = req.body
	try {
		const cart = await req.user.getCart()
		if (cart) {
			const products = await cart.getProducts({ where: { id: productId } })
			if (products) {
				const product = products[0]
				const deletedProduct = await product.cartItem.destroy()
				if (deletedProduct) {
					res.redirect('/cart')
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}
