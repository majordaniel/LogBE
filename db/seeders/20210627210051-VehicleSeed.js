'use strict';

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
     await queryInterface.bulkInsert('Vehicles', 
     [
       {
          name: 'bike',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626806612/icons8-quad-bike-90_1.png',
          description: '30kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'tricycle',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626806940/icons8-quad-bike-90_1_1.png',
          description: '500kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'mini van',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626806956/icons8-quad-bike-90_1_2.png',
          description: '1000kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'buses',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626806964/icons8-quad-bike-90_1_3.png',
          description: '2000kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'cars',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626806970/icons8-quad-bike-90_1_4.png',
          description: '800kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'truck',
          image_url: 'https://res.cloudinary.com/maaj/image/upload/v1626807161/icons8-quad-bike-90_1_5.png',
          description: '8000kg max',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Vehicles', null, {});
  }
};
