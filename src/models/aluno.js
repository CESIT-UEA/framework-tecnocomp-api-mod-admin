const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");

const Aluno = sequelize.define(
  "Aluno",
  {
    id_aluno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ltiUserId: {
      type: DataTypes.STRING,
    },
    nome: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    ltik: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "Alunos",
    timestamps: false,
  }
);

module.exports = Aluno;
