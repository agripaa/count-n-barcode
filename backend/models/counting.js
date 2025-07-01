'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Counting extends Model {
    static associate(models) {
      Counting.belongsTo(models.Identity, { foreignKey: 'identity_id' })
    }
  }
  Counting.init({
    count: DataTypes.INTEGER,
    predicted_date: DataTypes.DATE,
    predicted_time: DataTypes.TIME,
    identity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Counting',
  });
  return Counting;
};
