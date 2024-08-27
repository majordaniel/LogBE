'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      user_id: {
        type: Sequelize.UUID
      },
      description: {
        type: Sequelize.STRING
      },
      trip_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      reference: {
        type: Sequelize.STRING
      },
      response: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};