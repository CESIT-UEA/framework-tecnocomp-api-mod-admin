const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('db', 'root', 'root', {
    host: '172.25.68.14',
    dialect: 'mysql'
  });

module.exports = { sequelize }