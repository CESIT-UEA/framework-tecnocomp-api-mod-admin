const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Topico = require("./topico");

const SaibaMais = sequelize.define(
  "SaibaMais",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_topico: {
      type: DataTypes.INTEGER,
      references: {
        model: Topico,
        key: "id",
      },
    },
    descricao: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },{
    timestamps: false,
  }
);

Topico.hasMany(SaibaMais, { foreignKey: "id_topico" });
SaibaMais.belongsTo(Topico, { foreignKey: "id_topico" });

module.exports = SaibaMais;
