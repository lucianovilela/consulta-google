const { Sequelize, DataTypes } = require("sequelize");
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
    dataNascimento: {
      type: DataTypes.DATE,
    },
    signo: {
      type: DataTypes.STRING,
    },

    imagem: {
      type: DataTypes.STRING,
    },

    like: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    dislike: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
  });
  return consulta;
};
