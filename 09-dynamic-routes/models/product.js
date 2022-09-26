const fs = require('fs')
const path = require('path')

const Cart = require('./cart')

const p = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'products.json'
)

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([])
		} else {
			cb(JSON.parse(fileContent))
		}
	})
}

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id
		this.title = title
		this.imageUrl = imageUrl
		this.description = description
		this.price = price
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				// edit product
				const existingProductIndex = products.findIndex((p) => p.id === this.id)
				const updatedProduct = [...products]
				updatedProduct[existingProductIndex] = this
				fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
					console.log(err)
				})
			} else {
				// add product
				this.id = Math.random().toString()
				products.push(this)
				fs.writeFile(p, JSON.stringify(products), (err) => {
					console.log(err)
				})
			}
		})
	}

	static fetchAll(cb) {
		getProductsFromFile(cb)
	}

	static findById(productId, cb) {
		if (!productId) return console.log('Product ID not found')
		getProductsFromFile((products) => {
			const product = products.find((p) => p.id === productId)
			cb(product)
		})
	}

	static deleteById(productId, cb) {
		if (!productId) return console.log('Product ID not found')
		getProductsFromFile((products) => {
			const product = products.find((p) => p.id === productId)
			const updatedProducts = products.filter((p) => p.id !== productId)
			fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
				if (!err) {
					Cart.deleteProduct(productId, product.price)
				} else {
					console.log(err)
				}
			})
			cb()
		})
	}
}
