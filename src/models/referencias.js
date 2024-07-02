const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Topico = require("./topico");

const Referencias = sequelize.define("Referencias", {
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
  caminhoDaImagem: {
    type: DataTypes.STRING,
  },
  referencia: {
    type: DataTypes.TEXT,
  },
},{
  timestamps: false,
});

Topico.hasMany(Referencias, { foreignKey: 'id_topico' });
Referencias.belongsTo(Topico, { foreignKey: 'id_topico' });

module.exports = Referencias;
