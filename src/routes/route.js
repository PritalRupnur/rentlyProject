
const express = require('express')
const { Router } = require('express');
const router = Router();
const { celebrate, Joi, errors, Segments } = require('celebrate');
const userController = require('../controller/userController');
const app = express();

//createUser
router.post('/createUsers', celebrate({body:Joi.object().keys({
    name: Joi.string(),
    age: Joi.number().integer(),
   email: Joi.string(),
   gender: Joi.string().valid('Male', 'Female', 'Others')
  })}), userController.createUser);

//getUser
router.get('/getUsers/:id', celebrate({params:Joi.object().keys({
    id: Joi.number()
})}), userController.getUserById);


//updateUser
router.put('/updateUsers/:id',celebrate({[Segments.BODY]:Joi.object().keys({
    name: Joi.string(),
    age: Joi.number().integer(),
   email: Joi.string(),
   gender: Joi.string().valid('Male', 'Female', 'Others')
  })}), userController.updateUser)

//deleteUser
router.delete('/deleteUsers/:id',celebrate({[Segments.PARAMS]:Joi.object().keys({
    id: Joi.number()
})}), userController.deleteUser);

app.use(errors());

module.exports = router;






//{getUserById, createUser, updateUser, updateUser}
