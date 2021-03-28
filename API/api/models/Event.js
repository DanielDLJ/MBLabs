const Sequelize = require("sequelize");
const db = require("../config/database");
const Category = require("./Category");
const Company = require("./Company");

const Event = db.sequelize.define(
  "event",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    company_cnpj: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cep: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    complement: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    district: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    celular: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  },
  {
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: "event",
  }
);

Category.hasOne(Event, { foreignKey: "category_id" });
Event.belongsTo(Category, { foreignKey: "category_id", targetKey: "id" });

Company.hasMany(Event, { foreignKey: "company_cnpj" });
Event.belongsTo(Company, { as: 'company_cnpjs', foreignKey: "company_cnpj", targetKey: "cnpj" });

module.exports = Event;
