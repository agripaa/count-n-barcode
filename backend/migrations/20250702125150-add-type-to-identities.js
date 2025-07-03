'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Identities', 'type', {
      type: Sequelize.ENUM('counting', 'barcode'),
      allowNull: false,
      defaultValue: 'counting'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Identities', 'type');
  }
};
