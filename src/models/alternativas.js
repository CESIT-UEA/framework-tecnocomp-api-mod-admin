const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Alternativas = sequelize.define('Alternativas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_exercicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Exercicios',
      key: 'id',
    },
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  explicacao: {
    type: DataTypes.TEXT,
  },
  correta: {
    type: DataTypes.BOOLEAN,
  },
}, {
  tableName: 'Alternativas',
  timestamps: false,
});

module.exports = Alternativas;
