'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Identity extends Model {
    static associate(models) {
      Identity.hasMany(models.User, { foreignKey: 'identity_id' })
      Identity.hasMany(models.Counting, { foreignKey: 'identity_id' })
      Identity.hasMany(models.Barcode, { foreignKey: 'identity_id' })
    }
  }
  Identity.init({
    IP: DataTypes.STRING,
    temp: DataTypes.STRING,
    type: DataTypes.ENUM('counting', 'barcode')
  }, {
    sequelize,
    modelName: 'Identity',
  });
  return Identity;
};
