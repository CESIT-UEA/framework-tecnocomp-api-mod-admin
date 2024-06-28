const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize('banco_sql_tecnocomp', 'root', 'paradeusar1', {
    host: 'localhost',
    dialect: 'mysql'
  });



module.exports = { sequelize }
// module.exports = Artigo