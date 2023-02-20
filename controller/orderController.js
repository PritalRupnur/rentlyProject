const db = require('../models/index');
const jwt = require('jsonwebtoken');


// createorder
const createOrder = async function(req, res, next) {
    await db.order.createOrder(req.body.productname, req.body.totalPrice, req.body.totalQuantity, req.body.status, req.body.Cancellable, req.params.userId)
      .then((data) => {
         res.status(200).json({
          success: true, data,
        });
      }).catch(next);
  };


  // getOrder
  const getOrder = async function(req, res, next) {
    await db.order.getOrder(req.params.orderId)
    .then((data) => {
      res.status(200).json({
        success: true, data,
      });
    }).catch(next);
  };


  // updateOrder
  const updateOrder = async function(req, res, next) {
   
     await db.order.updateOrder(req.body.productname, req.body.totalPrice, req.body.totalQuantity, req.body.status, req.body.Cancellable, req.body.userId, req.params.orderId)
     
     .then((data) => {
       res.status(200).json({
         success: true, data,
       });
     }).catch(next);
   };

   // deleteOrder

   const deleteOrder = async function(req, res, next) {
     await db.order.updateOrder(req.params.id, req.params.userId)
     .then((data) => {
       res.status(200).json({
         success: true, data,
       });
     }).catch(next);
   };
  module.exports = {createOrder, getOrder, updateOrder, deleteOrder};
