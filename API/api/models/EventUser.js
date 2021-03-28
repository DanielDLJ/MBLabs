const Sequelize = require("sequelize");
const db = require("../config/database");
const Event = require("./Event");
const User = require("./User");

const EventUser = db.sequelize.define(
  "user_event",
  {
    id_event: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    cpf_user: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: "user_event",
  }
);

Event.hasMany(EventUser, { foreignKey: 'id_event' });
EventUser.belongsTo(Event, { foreignKey: 'id_event', targetKey: 'id' });

User.hasMany(EventUser, { foreignKey: 'cpf_user' });
EventUser.belongsTo(User, { foreignKey: 'cpf_user', targetKey: 'cpf' });

module.exports = EventUser;
