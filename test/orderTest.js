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

describe('Orders', () => {
  let createUser;
  let tokenNeeded;
  let user;
  let userId;
  beforeEach(async () => {

    user = {
      name: 'Sita',
      age: 21,
      email: 'sita@gmail.com',
      gender: 'Female',
    };

    createUser = await db.sequelize.models.user.create(user);

  });

  beforeEach((done) => {
    const loginDetails = {
      name: 'Sita',
    };
    chai
      .request('http://localhost:3000')
      .post('/login')
      .send(loginDetails)
      .end((err, res) => {
        tokenNeeded = res.body.data.token;
        tokenUserId = res.body.data.userId;
        res.should.have.status(200);
        res.body.data.should.have.property('token');
          res.body.data.should.have.property('userId');
          
        done();
      });
  

  afterEach(async () => { // after each test we empty the database
    databaseCleaner.clean(client, (err) => {
     
    });
  });

  // describe block for creating order
  describe('/createOrder/:userId', () => {



    it('it should create a order with proper requirements', (done) => {
      order = {
        productname: 'Laptop',
        totalPrice: 100000,
        totalQuantity: 1,
        status: 'Pending',
        Cancellable: true,
      };
      chai.request('http://localhost:3000')
        .post('/createOrder/' + tokenUserId)
        .set({Authorization: `Bearer ${tokenNeeded}`})

        .send(order)
        .end((err, res) => {

          res.should.have.status(200);

          res.body.should.be.a('object');
          // res.body.should.have.property('message').eql('User created successfully');
          res.body.data.should.have.property('productname');
          res.body.data.should.have.property('totalPrice');
          res.body.data.should.have.property('totalQuantity');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('userId').eql(tokenUserId);
          res.body.data.should.have.property('Cancellable');



          done();
        });
    });
  });


  // test the get user by id api
  describe('/GET/:id order', () => {

     
      let orderId;
      let order;
      let createOrder;
      

      beforeEach(async () => {

        order = {
          productname: 'Smartwatch',
          totalPrice: 21000,
          totalQuantity: 1,
          userId: tokenUserId,
          status: 'Pending',
        };
    
        createOrder = await db.sequelize.models.order.create(order);
    
      });

    it('it should GET order by the given id', async function() {
      
       chai.request('http://localhost:3000')
        .get('/getOrder/' + createOrder.id)
        .set({Authorization: `Bearer ${tokenNeeded}`})

         .send(order)
        .end((err, res) => {
           res.should.have.status(200);
          // res.body.data.should.be.a('Array');// expect(res.body.data).to.deep.equal({});
        //   res.body.data.should.have.property('productname');
        //   res.body.data.should.have.property('totalPrice');
        //   res.body.data.should.have.property('totalQuantity');
        //   res.body.data.should.have.property('status');
        //   res.body.data.should.have.property('Cancellable');
         });
    });
  });

  // describe to test the update api
  describe('/PUT/:id user', () => {

    let order;
    let createOrder;

    beforeEach(async () => {

      order = {
        productname: 'Smartwatch',
        totalPrice: 21000,
        totalQuantity: 1,
        userId: tokenUserId,
        status: 'Pending',
        Cancellable: true,
      };
  
      createOrder = await db.sequelize.models.order.create(order);
  
    });

    it('it should UPDATE a user given the id', async function() {


     
      chai.request('http://localhost:3000')
        .put('/updateOrder/' + createOrder.id)
        .set({Authorization: `Bearer ${tokenNeeded}`})
    
        .send({
          productname: 'Drone',
        totalPrice: 21000,
        totalQuantity: 1,
        userId: tokenUserId,
        status: 'Pending',
        Cancellable: true,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          // res.body.should.have.property('message').eql('User updated!');
        });
    });
  });

  // test casese for delete api.
  describe('/DELETE/:id book', () => {
    let order;
    let createOrder;

    beforeEach(async () => {

      order = {
        productname: 'Smartwatch',
        totalPrice: 21000,
        totalQuantity: 1,
        userId: tokenUserId,
        status: 'Pending',
        Cancellable: true,
      };
  
      createOrder = await db.sequelize.models.order.create(order);
  
    });

    it('it should DELETE a book given the id', async function() {

      chai.request('http://localhost:3000')
        .delete('/deleteUsers/' + createUser.id)
        .set({Authorization: `Bearer ${tokenNeeded}`})
    
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User has been deleted successfully');
        });
    });
  });

  
});
});
