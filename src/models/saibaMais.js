const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const SaibaMais = sequelize.define('SaibaMais', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_topico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Topicos',
      key: 'id',
    },
  },
  descricao: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'SaibaMais',
  timestamps: false,
});

module.exports = SaibaMais;
