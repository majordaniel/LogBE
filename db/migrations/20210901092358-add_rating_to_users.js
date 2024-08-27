'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('Users', 'rating', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });
    await queryInterface.addColumn('Companies', 'rating', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('Users', 'rating');
     await queryInterface.removeColumn('Companies', 'rating');

  }
};
