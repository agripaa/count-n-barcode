'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barcode extends Model {
    static associate(models) {
      Barcode.belongsTo(models.Identity, { foreignKey: 'identity_id' })
    }
  }
  Barcode.init({
    code: DataTypes.STRING,
    predicted_date: DataTypes.DATE,
    predicted_time: DataTypes.TIME,
    identity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Barcode',
  });
  return Barcode;
};
