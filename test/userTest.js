const chai = require('chai');
const assert = require('assert');
const userController = require('../controller/userController');
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
// The main describe block to empty the db.

function person(name, fullname) {
  this.name = name;
  this.fullname = fullname;
}

person.prototype.greetings = function() {
  return `Hello ${this.name} ${this.fullname}`;
};


describe('Users', () => {
  let createUser;
  let user;
  let token;
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
        token = res.body.data.token;
        
        res.should.have.status(200);
        done();
      });
  });

  
  afterEach( (done) => { // after each test we empty the database
    databaseCleaner.clean(client, (err) => {
    done();
    });
  });




  // stub for practice
  describe('sample stub for practice', () => {


    it('should pass', () => {
      const name = new person('sita', 'gita');
       const result1 = name.greetings();
      name.greetings().should.eql('Hello sita gita');
      sinon.stub(person.prototype, 'greetings').returns('Hello everyone here');
      name.greetings().should.eql('Hello everyone here');

    });
  });

  describe('User Login', function() {

    it('it sholud login the user', async function() {
      const loginDetails = {
        name: 'Sita',
      };
       chai.request('http://localhost:3000')

        
        .post('/login')

        
        .send(loginDetails)
        
        .end((err, res) => { 
          res.should.have.status(200);
          console.log('this runs the login part');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('userId');
          
           token = res.body.token;
        });
    });
  });



  // describe block for creating user
  describe('/createUser', () => {

    it('it should create a user with proper requirements', () => {
      user = {
        name: 'Rani',
        age: 21,
        email: 'kir@gmail.com',
        gender: 'Female',
      };
      chai.request('http://localhost:3000')
        .post('/createUsers')
        .send(user)
        .end((err, res) => {

          res.should.have.status(201);

          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User created successfully');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('age');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('gender');



        });
    });
  });


  // test the get user by id api
  describe('/GET/:userId user', () => {

    
  

    it('it should GET a user by the given id', async function() {
      chai.request('http://localhost:3000')
        .get('/getUsers/' + createUser.id)
        .set({Authorization: `Bearer ${token}`})
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('age');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('gender');
          res.body.data.should.have.property('id').eql(createUser.id);
        });
    });
  });

  // describe to test the update api
  describe('/PUT/:id user', () => {


    it('it should UPDATE a user given the id', async function() {


      chai.request('http://localhost:3000')
        .put('/updateUsers/' + createUser.id)
        .send({
          name: 'Deepika',
          age: 22,
          email: 'deepa.p@gmail.com',
          gender: 'Female',
        })
        .set({Authorization: `Bearer ${token}`})
        
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User updated!');
           res.body.data.should.have.property('id').eql(createUser.id);
        
        });
    });
  });

  // test casese for delete api.
  describe('/DELETE/:id book', () => {

    it('it should DELETE a user given the id', async function() {

      chai.request('http://localhost:3000')
        .delete('/deleteUsers/' + createUser.id)
        .set({Authorization: `Bearer ${token}`})
        
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User has been deleted successfully');
        });
    });
  });

  // describe("UserController test case", function () {
  //  it('gender should be always male female or others', function () {
  //      userControlRentlyler.createUser({"name":"Rama", "age":"15", "email":"rama@gmail.com", "gender":"Male"} )

  //         assert.equal("Hello".length, 4);
  //     });
  //  it('should return first charachter of the string', function () {
  //         assert.equal("Hello".charAt(0), 'H');
  //     });
});
