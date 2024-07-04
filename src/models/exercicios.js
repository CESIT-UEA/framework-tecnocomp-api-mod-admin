const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Exercicios = sequelize.define('Exercicios', {
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
  questao: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'Exercicios',
  timestamps: false,
});

module.exports = Exercicios;
