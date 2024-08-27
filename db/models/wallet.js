'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
        },
        targetKey: 'id',
        as: 'user'
      });
    }
  };
  Wallet.init({
    user_id: DataTypes.UUID,
    balance: {
     type: DataTypes.INTEGER,
     defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Wallet',
  });

  Wallet.prototype.toJSON = function() {
    var values = Object.assign({}, this.get());
    values.balance = Math.round((values.balance/100), 2)
    return values;
  }
  return Wallet;
};