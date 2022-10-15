const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = async (cb) => {
	try {
		const client = await MongoClient.connect(
			'mongodb+srv://muhazizal:47RBNEtaXjC2Ohxe@cluster0.3koisgd.mongodb.net/?retryWrites=true&w=majority'
		)
		if (client) {
			console.log('MongoClient connected')
			cb(client)
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = mongoConnect
