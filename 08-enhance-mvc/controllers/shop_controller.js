const Product = require('../models/product_model')

exports.getIndex = (req, res, next) => {
	Product.fetchAllProduct((products) => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'All Products',
			path: '/',
		})
	})
}

exports.getProducts = (req, res, next) => {
	Product.fetchAllProduct((products) => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'Products',
			path: '/products',
		})
	})
}

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		pageTitle: 'Cart',
		path: '/cart',
	})
}

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		pageTitle: 'Orders',
		path: '/orders',
	})
}

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
	})
}
