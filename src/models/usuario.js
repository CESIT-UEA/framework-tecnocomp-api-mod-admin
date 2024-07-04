const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('adm', 'professor'),
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'Usuarios',
  timestamps: false,
});

module.exports = Usuario;
