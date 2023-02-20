
const express = require('express');
const {Router} = require('express');
const router = Router();
const {celebrate, Joi, errors, Segments} = require('celebrate');
const userController = require('../controller/userController');
const orderController = require('../controller/orderController');
const app = express();
const middleware = require('../lib/auth');

// userLogin
router.post('/login', celebrate({body: Joi.object().keys({
  name: Joi.string(),
  
})}), userController.login);

// createUser
router.post('/createUsers', celebrate({body: Joi.object().keys({
  name: Joi.string(),
  age: Joi.number().integer(),
  email: Joi.string(),
  gender: Joi.string().valid('Male', 'Female', 'Others'),
})}), userController.createUser);

// getUser
router.get('/getUsers/:userId', celebrate({params: Joi.object().keys({
  userId: Joi.number(),
})}), middleware.authentication, userController.getUserById);


// updateUser
router.put('/updateUsers/:userId', celebrate({body: Joi.object().keys({
  name: Joi.string(),
  age: Joi.number().integer(),
  email: Joi.string(),
  gender: Joi.string().valid('Male', 'Female', 'Others'),
})}), middleware.authentication, middleware.authorization, userController.updateUser);

// deleteUser
router.delete('/deleteUsers/:userId', celebrate({[Segments.PARAMS]: Joi.object().keys({
  userId: Joi.number(),
})}), middleware.authentication, middleware.authorization, userController.deleteUser);

 // //___________________________________________order API's_______________________________




router.post('/createOrder/:userId', celebrate({body: Joi.object().keys({
  productname: Joi.string(),
  totalQuantity: Joi.number(),
  totalPrice: Joi.number(),
  status: Joi.string().valid('Completed', 'Cancelled', 'Pending'),
  Cancellable: Joi.boolean(),
})}), middleware.authentication, middleware.authorization, orderController.createOrder);


// getOrders
router.get('/getOrder/:orderId', celebrate({[Segments.PARAMS]: Joi.object().keys({
  orderId: Joi.number(),
  
})}), middleware.authentication, orderController.getOrder);


// updateOrder
router.put('/updateOrder/:orderId', celebrate({
  body: Joi.object().keys({
  productname: Joi.string(),
  totalQuantity: Joi.number(),
  totalPrice: Joi.number(),
  userId: Joi.number(),
  status: Joi.string().valid('Completed', 'Cancelled', 'Pending'),
  Cancellable: Joi.boolean(),
}),
params: Joi.object().keys({
  orderId: Joi.number(),
 
})}), middleware.authentication, middleware.authorization, orderController.updateOrder);

// deleteOrder
router.delete('/deleteOrder/:orderId/:userId', celebrate({[Segments.PARAMS]: Joi.object().keys({
  orderId: Joi.number(),
  userId: Joi.number(),
})}), middleware.authentication, middleware.authorization, orderController.deleteOrder);


app.use(errors());

module.exports = router;


// {getUserById, createUser, updateUser, updateUser}
