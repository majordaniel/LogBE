'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiderReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiderReview.belongsTo(models.User, {
        foreignKey:'user_id',
      });
      RiderReview.belongsTo(models.Trip, {
        foreignKey:'trip_id',
      });
      RiderReview.belongsTo(models.User, {
        foreignKey:'rider_id',
        as: 'rider'
      });
    }
  };
  RiderReview.init({
    user_id: DataTypes.UUID,
    trip_id: DataTypes.UUID,
    rider_id: DataTypes.UUID,
    comment: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RiderReview',
  });
  return RiderReview;
};