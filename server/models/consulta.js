const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("./index");
module.exports = (sequelize, DataTypes) => {
  const consulta = sequelize.define("consulta", {
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
    dataNascimento:{
      type: DataTypes.DATE
    },
    signo:{
      type: DataTypes.STRING,
    },

    imagem: {
      type: DataTypes.STRING,
    },

    like: {
      type: DataTypes.INTEGER,
    },
    dislike: {
      type: DataTypes.INTEGER,
    },
  });
  return consulta;
};
