const Sequelize = require('sequelize')

const sequelize = new Sequelize('learn-nodejs', 'root', '@Guitar26', {
	dialect: 'mysql',
	host: 'localhost',
})

module.exports = sequelize
