const Sequelize = require('sequelize')
const db = {}
const sequelize =  new Sequelize('event_day', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: '0',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db