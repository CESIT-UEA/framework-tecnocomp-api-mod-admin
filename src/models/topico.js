const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Topico = sequelize.define('Topico', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Modulos',
      key: 'id',
    },
  },
  nome_topico: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ebookUrlGeral: {
    type: DataTypes.STRING,
  },
  textoApoio: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'Topicos',
  timestamps: false,
});

module.exports = Topico;