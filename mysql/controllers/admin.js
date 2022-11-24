const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	})
}

exports.postAddProduct = async (req, res, next) => {
	const { title, imageUrl, price, description } = req.body
	try {
		const product = await req.user.createProduct({
			title,
			price,
			imageUrl,
			description,
		})
		if (product) {
			console.log('postAddProduct response', product)
			res.redirect('/admin/products')
		}
	} catch (error) {
		console.log('postAddProduct error', error)
	}
}

exports.getEditProduct = async (req, res, next) => {
	const { isEditing } = req.query
	const { productId } = req.params
	if (!isEditing || !productId) return res.redirect('/')
	try {
		const products = await req.user.getProducts({ where: { id: productId } })
		const product = products[0]
		if (product) {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: isEditing,
				product: product,
			})
		}
	} catch (error) {
		console.log('getEditProduct error', error)
	}
}

exports.postEditProduct = async (req, res, next) => {
	const { productId, title, imageUrl, price, description } = req.body
	try {
		const products = await req.user.getProducts({ where: { id: productId } })
		const product = products[0]
		if (product) {
			console.log('postEditProduct product', product)
			product.title = title
			product.imageUrl = imageUrl
			product.price = price
			product.description = description
			const savedProduct = await product.save()
			if (savedProduct) {
				console.log('postEditProduct savedProduct', savedProduct)
				res.redirect('/admin/products')
			}
		}
	} catch (error) {
		console.log('postEditProduct error', error)
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const products = await req.user.getProducts()
		if (products) {
			console.log('getProducts response', products)
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			})
		}
	} catch (error) {
		console.log('getProducts error', error)
	}
}

exports.postDeleteProduct = async (req, res, next) => {
	const { productId } = req.body
	try {
		const products = await req.user.getProducts({ where: { id: productId } })
		const product = products[0]
		if (product) {
			console.log('postDeleteProduct product', product)
			const deletedProduct = await product.destroy()
			if (deletedProduct) {
				console.log('postDeleteProduct deletedProduct', deletedProduct)
				res.redirect('/admin/products')
			}
		}
	} catch (error) {
		console.log('postDeleteProduct error', error)
	}
}
