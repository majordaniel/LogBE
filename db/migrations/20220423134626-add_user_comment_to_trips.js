'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Trips', 'tp_comment', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('Trips', 'pickup_time');

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('Trips', 'tp_comment');
     await queryInterface.addColumn('Trips', 'pickup_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
