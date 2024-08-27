'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Trips', 'pickup_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Trips', 'pickup_time', {
      type: Sequelize.STRING,
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
     await queryInterface.removeColumn('Trips', 'pickup_date');

     await queryInterface.removeColumn('Trips', 'pickup_time');

  }
};
