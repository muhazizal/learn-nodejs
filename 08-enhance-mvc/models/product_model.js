const fs = require('fs')
const productPath = require('../util/productPath')

const getProductsFromFile = (cb) => {
	fs.readFile(productPath, (error, fileContent) => {
		if (error) {
			cb([])
		} else {
			cb(JSON.parse(fileContent))
		}
	})
}

module.exports = class Product {
	constructor(title, imageUrl, price, description) {
		this.title = title
		this.imageUrl = imageUrl
		this.price = price
		this.description = description
	}

	saveProduct() {
		getProductsFromFile((products) => {
			products.push(this)
			fs.writeFile(productPath, JSON.stringify(products), (error) => {
				console.error(error)
			})
		})
	}

	static fetchAllProduct(cb) {
		getProductsFromFile(cb)
	}
}
