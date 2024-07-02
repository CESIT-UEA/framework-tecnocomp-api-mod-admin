const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = { sequelize }
// module.exports = Artigo