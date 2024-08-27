'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Trip.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
        },
        targetKey: 'id',
        as: 'user'
      });

      Trip.belongsTo(models.User, {
        foreignKey: {
          name: 'rider_id',
        },
        as: 'rider',
        targetKey: 'id'
      });

      Trip.belongsTo(models.Company, {
        foreignKey: 'company_id',
      });
    }
  };
  Trip.init({
    user_id: DataTypes.UUID,
    origin: DataTypes.JSON,
    destination: DataTypes.JSON,
    rider_id: DataTypes.UUID,
    company_id: DataTypes.UUID,
    weight: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    comment: DataTypes.TEXT,
    delivery_date: DataTypes.DATE,
    pickup_date: DataTypes.DATE,
    status: DataTypes.INTEGER,
    completed_date: DataTypes.DATE,
    images: DataTypes.JSON,
    amount: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN,
    distance: DataTypes.STRING,
    time_estimate: DataTypes.STRING,
    invoice_number: DataTypes.STRING,
    tp_comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trip',
  });

  Trip.prototype.toJSON = function() {
    const statuses = ['NOT_STARTED', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REJECTED', 'EN_ROUTE', 'DELIVERED']
    var values = Object.assign({}, this.get());
    values.status = statuses[values.status]
    // convert amount to naira
    values.amount = Math.round((values.amount/100), 2)
    return values;
  }

  return Trip;
};