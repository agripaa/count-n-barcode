'use strict'
const bcrypt = require('bcrypt')

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Ambil identity_id dari IP 1.1.1.1
    const [identity] = await queryInterface.sequelize.query(
      "SELECT id FROM `Identities` WHERE `IP` = '1.1.1.1' LIMIT 1;"
    )

    await queryInterface.bulkInsert('Users', [{
      name: 'Test User',
      username: 'test',
      password: hashedPassword,
      identity_id: identity[0]?.id || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'test' }, {})
  }
}
