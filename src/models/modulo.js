const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Modulo = sequelize.define('Modulo', {
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
    type: DataTypes.TEXT,
  },
  nativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id',
    },
  },
  plataforma_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PlataformaRegistro',
      key: 'id',
    },
  },
}, {
  tableName: 'Modulos',
  timestamps: false,
});

module.exports = Modulo;
