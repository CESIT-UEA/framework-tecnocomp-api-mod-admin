const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Topico = require("./topico");

const Exercicios = sequelize.define("Exercicios", {
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
  questao: {
    type: DataTypes.TEXT,
  },
},{
  timestamps: false,
});

Topico.hasMany(Exercicios, { foreignKey: 'id_topico' });
Exercicios.belongsTo(Topico, { foreignKey: 'id_topico' });

module.exports = Exercicios;
