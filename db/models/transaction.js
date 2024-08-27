'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transaction.init({
    user_id: DataTypes.UUID,
    trip_id: DataTypes.UUID,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    is_paid: DataTypes.BOOLEAN,
    reference: DataTypes.STRING,
    response: DataTypes.JSON   
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  Transaction.prototype.toJSON = function() {
    const statuses = ['INITIALISED', 'SUCCESS', 'FAILED']
    var values = Object.assign({}, this.get());
    values.status = statuses[values.status]
    values.amount = Math.round((values.amount/100), 2)
    return values;
  }
  return Transaction;
};