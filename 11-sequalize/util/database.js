const mysql = require('mysql2')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'learn-nodejs',
	password: '@Admin132',
})

module.exports = pool.promise()
