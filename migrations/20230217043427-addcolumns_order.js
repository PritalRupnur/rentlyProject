'use strict';

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
      await queryInterface.addColumn('orders', 'userId', {type: Sequelize.INTEGER}, {references: {
        model: 'Users', // 'Actors' would also work
        key: 'id',
        as: 'userId',
      }});
     await queryInterface.addColumn('orders', 'totalPrice', {type: Sequelize.INTEGER});
      await queryInterface.addColumn('orders', 'totalQuantity', {type: Sequelize.INTEGER});
      await queryInterface.addColumn('orders', 'status', {type: Sequelize.DataTypes.ENUM, values: ['Completed', 'Cancelled', 'Pending']});
      await queryInterface.addColumn('orders', 'Cancellable', {type: Sequelize.DataTypes.BOOLEAN});

     
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
  },
};
