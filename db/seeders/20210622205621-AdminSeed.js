'use strict';
const {hashPassword} = require('../../utils/helpers');
const models = require('../models');
const { Role } = models;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const role = await Role.findOne({where: {name: 'admin'} });
     await queryInterface.bulkInsert('Users', 
     [
       {
          first_name: 'super',
          last_name: 'admin',
          phone: '07019811419',
          password: await hashPassword('SuperSecretPassword'),
          email: 'admin@izigo.ng',
          role_id: role.id,
          is_active: true,
          is_verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Users', null, {});
  }
};
