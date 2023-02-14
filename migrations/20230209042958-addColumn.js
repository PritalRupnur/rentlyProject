'use strict';
// var DataTypes = require('sequelize/lib/data-types');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('users', 'age', {type: Sequelize.INTEGER});
      await queryInterface.addColumn('users', 'email', {type: Sequelize.STRING});
      await queryInterface.addColumn('users', 'gender', {type: Sequelize.DataTypes.ENUM, values: ['Male', 'Female', 'Others']});

      // await queryInterface.addIndex(
      //   'Person',
      //   'petName',
      //   {
      //     fields: 'petName',
      //     unique: true,
      //     transaction,
      //   }
      // );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // await queryInterface.removeColumn('Person', 'petName', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
