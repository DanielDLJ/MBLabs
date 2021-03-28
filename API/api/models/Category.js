const Sequelize = require('sequelize')
const db = require('../config/database')

module.exports = db.sequelize.define('category',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
},{
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'category'}
)