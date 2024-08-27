'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.User, {
        foreignKey: 'company_id',
      });
      Company.hasMany(models.CompanyReview, {
        foreignKey: 'company_id',
      });
    }
  };
  Company.init({
    name: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    owner_id: DataTypes.UUID,
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    rating: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Company',
  });
  return Company;
};