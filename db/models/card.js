'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Card.init({
    user_id: DataTypes.UUID,
    last_four: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    customer_code: DataTypes.STRING,
    authorization_code: DataTypes.STRING,
    type: DataTypes.STRING,
    default: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};