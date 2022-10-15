const Sequelize = require('sequelize')

const sequelize = new Sequelize('learn-nodejs', 'root', '@Admin132', {
	dialect: 'mysql',
	host: 'localhost',
})

module.exports = sequelize
