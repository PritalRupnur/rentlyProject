const chai = require('chai');
const assert = require('assert');
const userController = require('../controller/userController');
const orderController = require('../controller/orderController');
const server = require('../app');
// const route = require('../src/index');
const db = require('../models/index');
const pg = require('pg');
const dbConfig = require('../config/config.json')['test'];

const conString = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`;
const client = new pg.Client(conString);
client.connect();
const DatabaseCleaner = require('database-cleaner');

const databaseCleaner = new DatabaseCleaner('postgresql');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const should = chai.should(); // eslint-disable-line no-unused-vars


chai.use(chaiHttp);

describe('order', ()=>{
  describe('createOrder', () =>{
    it('should create an order', async ()=>{
      const {id} = await db.sequelize.models.user.create({name: 'Raj', age: 21, email: 'email', gender: 'Male'});
      const orderResponse = await db.sequelize.models.order.createOrder('productname', 27000, 3, 'Pending', true, id);
      console.log(orderResponse);
    });
  });

   describe('getOrder', () =>{

    it('should get the order of given user', async ()=>{

      const {id} = await db.sequelize.models.user.create({name: 'Raj', age: 21, email: 'email', gender: 'Male'});
     
      const requiredOrder = await db.sequelize.models.order.getOrder(id);
   
      console.log(requiredOrder);
   });
   });

   describe('updateOrder', ()=>{


    // productname, totalPrice, totalQuantity, status, Cancellable, userId, orderId) {
  
    it('should update the order of given user', async ()=>{

      const {id} = await db.sequelize.models.user.create({name: 'Raj', age: 21, email: 'email', gender: 'Male'});
      
      const orderResponse = await db.sequelize.models.order.createOrder('productname', 27000, 3, 'Pending', true, id);
     
      const updatedOrder = await db.sequelize.models.order.updateOrder('Laptop', 97000, 3, 'Pending', true, id, orderResponse.id);
     

    });

   });

   describe('deleteOrder', ()=>{

    it('should delete the order of given user', async ()=>{

      const {id} = await db.sequelize.models.user.create({name: 'Raj', age: 21, email: 'email', gender: 'Male'});
      
      const ordertoDelete = await db.sequelize.models.order.createOrder('productname', 27000, 3, 'Pending', true, id);
     
      const deleteResponse = await db.sequelize.models.order.deleteOrder(ordertoDelete.id, id);
     
     

    });
   });

});


