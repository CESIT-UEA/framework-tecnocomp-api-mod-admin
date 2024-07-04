const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Aluno = sequelize.define('Aluno', {
  ltiUserId: {
    type: DataTypes.STRING,
    primaryKey: true,
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
}, {
  sequelize,
  tableName: 'Alunos',
  timestamps: false,
});

module.exports = Aluno;
