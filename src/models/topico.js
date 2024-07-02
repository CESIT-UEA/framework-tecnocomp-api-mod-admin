const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");
const Modulo = require("./modulo");

const Topico = sequelize.define("Topico", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    references: {
      model: Modulo,
      key: 'id'
    }
  },
  nome_topico: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ebookUrlGeral: {
    type: DataTypes.STRING,
  },
  textoApoio: {
    type: DataTypes.STRING,
  },
},{
  sequelize,
  tableName: 'Topico', // Define explicitamente o nome da tabela
  timestamps: false,
});

Modulo.hasMany(Topico, { foreignKey: 'id_modulo' });
Topico.belongsTo(Modulo, { foreignKey: 'id_modulo' });

module.exports = Topico;
