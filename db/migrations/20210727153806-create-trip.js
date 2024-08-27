'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      user_id: {
        type: Sequelize.UUID
      },
      origin: {
        type: Sequelize.JSON
      },
      destination: {
        type: Sequelize.JSON
      },
      rider_id: {
        type: Sequelize.UUID
      },
      company_id: {
        type: Sequelize.UUID
      },
      weight: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      completed_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      amount: {
        type: Sequelize.INTEGER
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      isPaid: {
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
    await queryInterface.dropTable('Trips');
  }
};