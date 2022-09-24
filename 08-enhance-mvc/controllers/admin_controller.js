const Product = require('../models/product_model')

exports.getAddProducts = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
	})
}

exports.postAddProducts = (req, res, next) => {
	const { title, imageUrl, price, description } = req.body
	const product = new Product(title, imageUrl, price, description)
	product.saveProduct()
	res.redirect('/')
}

exports.getProducts = (req, res, next) => {
	Product.fetchAllProduct((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		})
	})
}
