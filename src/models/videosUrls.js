const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Topico = require("./topico");

const VideoUrls = sequelize.define("VideoUrls", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_topico: {
    type: DataTypes.INTEGER,
    references: {
      model: Topico,
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
  },
},{
  timestamps: false,
});

Topico.hasMany(VideoUrls, { foreignKey: 'id_topico' });
VideoUrls.belongsTo(Topico, { foreignKey: 'id_topico' });

module.exports = VideoUrls;
