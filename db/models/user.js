'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasMany(models.Otp, {
        foreignKey: 'user_id',
      });
  
      User.hasMany(models.PasswordResets, {
        foreignKey: 'user_id',
      });

      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
      });
      User.belongsTo(models.Company, {
        foreignKey: 'company_id',
      });
      User.belongsTo(models.Vehicle, {
        foreignKey: 'vehicle_id',
      });
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name'
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
    password: {
      type: DataTypes.STRING,
    },
    role_id: DataTypes.UUID,
    company_id: DataTypes.UUID,
    vehicle_id: DataTypes.UUID,
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      field: 'is_verified',
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    referal: {
      type: DataTypes.STRING,
      unique: true
    },
    referred_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      field: 'image_url'
    },
    expoToken: {
      type: DataTypes.STRING,
      field: 'expo_token'
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
    hooks: {
      beforeCreate: user => user.password && user.hashPassword()
    },
    instanceMethods: {
    },
    sequelize,
    paranoid: true,
    modelName: 'User',
  });
  User.addHook('beforeCreate', function(user, option) {
    user.generateReferal();
  });

  User.prototype.hashPassword = async function hashPassword() {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
    return this.password;
  };

  User.prototype.toJSON = function() {
    var values = Object.assign({}, this.get());
    delete values.password;
    delete values.deletedAt;
    values['full_name'] = this.firstName +' '+ this.lastName;
    return values;
  },

  User.prototype.generateReferal = async function generateReferal() {
    this.referal = this.firstName+this.lastName+('' + Math.random()).substring(2, 6)
  }

  return User;
};