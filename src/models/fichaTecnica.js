const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const FichaTecnica = sequelize.define('FichaTecnica', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  modulo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Modulos',
      key: 'id',
    },
    unique: true,
  },
}, {
  tableName: 'FichasTecnicas',
  timestamps: false,
});

module.exports = FichaTecnica;
