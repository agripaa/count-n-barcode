'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi langsung ditulis di sini
      User.belongsTo(models.Identity, { foreignKey: 'identity_id' });
    }
  }

  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    identity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
