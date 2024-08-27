'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompanyReview.belongsTo(models.User, {
        foreignKey:'user_id',
      });
      CompanyReview.belongsTo(models.Trip, {
        foreignKey:'trip_id',
      });
      CompanyReview.belongsTo(models.Company, {
        foreignKey:'company_id',
      });
    }
  };
  CompanyReview.init({
    user_id: DataTypes.UUID,
    trip_id: DataTypes.UUID,
    company_id: DataTypes.UUID,
    comment: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CompanyReview',
  });
  return CompanyReview;
};