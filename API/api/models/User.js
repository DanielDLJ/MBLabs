const Sequelize = require('sequelize')
const db = require('../config/database')

module.exports = db.sequelize.define('user',{
    cpf: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cep:{
        type: Sequelize.STRING,
        allowNull: true
    },
    address:{
        type: Sequelize.STRING,
        allowNull: true
    },
    number:{
        type: Sequelize.STRING,
        allowNull: true
    },
    complement:{
        type: Sequelize.STRING,
        allowNull: true
    },
    district:{
        type: Sequelize.STRING,
        allowNull: true
    },
    city:{
        type: Sequelize.STRING,
        allowNull: true
    },
    state:{
        type: Sequelize.STRING,
        allowNull: true
    },
    celular:{
        type: Sequelize.STRING,
        allowNull: true
    },
    image:{
        type: Sequelize.STRING,
        allowNull: true
    },
    disabled:{
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
},{
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: 'user'}
)