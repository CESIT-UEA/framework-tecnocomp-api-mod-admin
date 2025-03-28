const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  retry: {
    max: 5
  }
});

module.exports = { sequelize }