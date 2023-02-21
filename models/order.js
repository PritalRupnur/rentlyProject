'use strict';



const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  order.init({
    productname: {type: DataTypes.STRING},
    totalPrice: {type: DataTypes.INTEGER},
    totalQuantity: {type: DataTypes.INTEGER},
    status: {type: DataTypes.ENUM('Completed', 'Cancelled', 'Pending')},
    Cancellable: {type: DataTypes.BOOLEAN},
    userId: {type: DataTypes.INTEGER,
    references: {
      model: 'user', // 'Movies' would also work
      key: 'id',
    },
  },
  }, {
    sequelize,
    modelName: 'order',
  });

  order.associate = function(models) {
    order.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };


  order.createOrder = async function( productname, totalPrice, totalQuantity, status, Cancellable, id) {
    const db = require('./index');

    const userId = id;
      const userExist = await db.sequelize.models.user.findOne({where: {id}});
      if (!userExist) {

      return 'User does not exist';
    }
    let newOrder;
    try {
      newOrder = await order.create({productname, totalPrice, totalQuantity, userId, status, Cancellable});

    } catch (err) {
      console.log({err});
    }
    console.log({newOrder});
    const userassociated = await newOrder.getUser();
    console.log({userassociated});
    const ordersassociated = await userassociated.getOrders();
    console.log({ordersassociated});
    return newOrder;
    
  };

  order.getOrder = async function(id) {

    
    const userId = id;
    const userProducts = await order.findAll({where: {id}});
    return userProducts;
      

  };

  order.updateOrder = async function( productname, totalPrice, totalQuantity, status, Cancellable, userId, orderId) {
  const {Sequelize, Op} = require('sequelize');
  const updateData = {};
  const id = orderId;

  if (productname!==undefined) {

    updateData.productname = productname;
  }
  if (totalPrice!==undefined) {

    updateData.totalPrice = totalPrice;
  }
  if (totalQuantity!==undefined) {

    updateData.totalQuantity = totalQuantity;
  }
  if (status!==undefined) {
    updateData.status = status;
  }
  if (Cancellable!==undefined) {
    updateData.Cancellable = Cancellable;
  }

  
 
  const updatedToData = await order.findOne({ 
    where: {
        
        id: orderId,
        userId: userId,
       }, 
});


if (!updatedToData) {
  return 'No such order with given user exist';
}

const updateddata = await updatedToData.update(updateData);


return updateddata;

 };

 order.deleteOrder = async function(orderId, userId) {

  const id = orderId;

  const orderToDelete =await order.findOne({ 
    where: {
        
        id: orderId,
        userId: userId,
       }, 
});
    const deletedOrder = await orderToDelete.destroy();

    if (deletedOrder) {
      return 'Order deleted successfully';
    }
    

 };
  return order;
};
