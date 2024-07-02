const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");

const Modulo = sequelize.define("Modulo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  video_inicial: {
    type: DataTypes.STRING,
  },
},{
  sequelize,
  tableName: 'Modulo', // Define explicitamente o nome da tabela,
  timestamps: false
});

module.exports = Modulo;
