const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('tecnocomp', 'tecnocomp', '0a463635baa5a', {
    host: 'localhost',
    dialect: 'mysql',
    port:3306
  });

module.exports = { sequelize }