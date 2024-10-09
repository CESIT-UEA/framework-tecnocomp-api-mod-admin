const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const VideoUrls = sequelize.define('VideoUrls', {
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
  url: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'videoUrls',
  timestamps: false,
});

module.exports = VideoUrls;
