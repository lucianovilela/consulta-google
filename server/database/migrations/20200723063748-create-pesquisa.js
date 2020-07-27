'use strict';

const { now } = require("moment");

module.exports = {
  up: async (queryInterface, Sequelize) => {

   await queryInterface.createTable('consulta', {
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
      imagem: {
        type: DataTypes.STRING,
      },

      criado: {
        allowNull: false,
        type: DataTypes.DATE,
        default:Date()
      },
      like: {
        type: DataTypes.INTEGER,
      },
      dislike: {
        type: DataTypes.INTEGER
      },

    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
