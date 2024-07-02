const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Exercicios = require("./exercicios");

const Alternativas = sequelize.define("Alternativas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_exercicio: {
    type: DataTypes.INTEGER,
    references: {
      model: Exercicios,
      key: 'id'
    }
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
},{
  timestamps: false,
});

Exercicios.hasMany(Alternativas, { foreignKey: 'id_exercicio' });
Alternativas.belongsTo(Exercicios, { foreignKey: 'id_exercicio' });

module.exports = Alternativas;
