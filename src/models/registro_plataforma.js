const { sequelize } = require('../db/connect.js');
const { DataTypes } = require('sequelize');

const Plataforma = sequelize.define("plataforma_registro",{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nomeCliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plataformaUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plataformaNome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idCliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
})




module.exports = Plataforma