const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	})
}

exports.postAddProduct = (req, res, next) => {
	const { title, imageUrl, price, description } = req.body
	const product = new Product(null, title, imageUrl, description, price)
	product.save()
	res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
	const { isEditing } = req.query
	const { productId } = req.params
	if (!isEditing || !productId) return res.redirect('/')
	Product.findById(productId, (product) => {
		if (!product) {
			alert('Product not found')
		} else {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: isEditing,
				product: product,
			})
		}
	})
}

exports.postEditProduct = (req, res, next) => {
	const { productId, title, imageUrl, price, description } = req.body
	const updatedProduct = new Product(
		productId,
		title,
		imageUrl,
		description,
		price
	)
	updatedProduct.save()
	res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		})
	})
}
