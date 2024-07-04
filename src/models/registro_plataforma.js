const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");

const PlataformaRegistro = sequelize.define(
  "PlataformaRegistro",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plataformaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plataformaNome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idCliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "plataformaRegistro",
    timestamps: false,
  }
);

module.exports = PlataformaRegistro;
