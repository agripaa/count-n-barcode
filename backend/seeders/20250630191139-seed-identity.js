'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Identities', [{
      IP: '1.1.1.1',
      temp: '30',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Identities', { IP: '1.1.1.1' }, {})
  }
}
