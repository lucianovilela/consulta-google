const { Sequelize, DataTypes } = require("sequelize");
const consulta  = require("./consulta");

module.exports = (sequelize, DataTypes) => {
  const sinonimo = sequelize.define("sinonimo", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
  sinonimo.belongsTo(consulta(sequelize,DataTypes ), {
    foreignKey: "consultaId",
    as: "consulta",
  });

  return sinonimo;
};
