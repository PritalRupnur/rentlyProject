let chai = require('chai');
var assert = require('assert');
const userController = require('../src/controller/userController')
const server = require('../src/index')
const route = require ('../src/index')
const db = require('../models/index')
const pg = require('pg');
const dbConfig = require("../config/config.json")['development']

const conString = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`;
const client = new pg.Client(conString);
client.connect();
const DatabaseCleaner = require('database-cleaner');

const databaseCleaner = new DatabaseCleaner('postgresql');

let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
//The main describe block to empty the db.
describe('Users',   () => {
    beforeEach(  (done) => { //Before each test we empty the database
        console.log("hi")
          databaseCleaner.clean(client, (err) => { 
            
           done();           
        });        
    });

    

    //describe block for creating user
     describe('/createUser', () => {
        it('it should create a user with proper requirements', (done) => {
            let user = {
                name: "Kiran",
                age: 21,
               email: "kir@gmail.com",
               gender:"Female"
            }
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
              done();
            });
      });
  });

  //test the get user by id api
 describe('/GET/:id user', () => {
    it.only('it should GET a user by the given id', (done) => {
        let user = new db.sequelize.models.user({
            name: "Sita",
            age: 21,
           email: "sita@gmail.com",
           gender:"Female"
        });
        user.save((err, user) => {
            chai.request('http://localhost:3000')
            console.log("Hellllo")
          .get('/getUsers/' + user.id)
          .send(user)
          .end((err, res) => {
            console.log(res)
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('age');
                res.body.data.should.have.property('email');
                res.body.data.should.have.property('gender');
                res.body.data.should.have.property('_id').eql(user.id);
            done();
        });
    });

});
});

//describe to test the update api
  describe('/PUT/:id user', () => {
      it('it should UPDATE a user given the id', (done) => {
          let user = new db.sequelize.models.user({
            name: "Alia",
            age: 21,
           email: "alia.b@gmail.com",
           gender:"Female"
        })
          user.save((err, user) => {
                chai.request('http://localhost:3000')
                .put('/updateUsers/:id' + user.id)
                .send({
                    name: "Deepika",
                    age: 22,
                   email: "deepa.p@gmail.com",
                   gender:"Female"
                })
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('User updated!');
                      
                  done();
                });
          });
      });
  });

});

// describe("UserController test case", function () {
//  it('gender should be always male female or others', function () {
//      userController.createUser({"name":"Rama", "age":"15", "email":"rama@gmail.com", "gender":"Male"} )

//         assert.equal("Hello".length, 4);
//     });
//  it('should return first charachter of the string', function () {
//         assert.equal("Hello".charAt(0), 'H');
//     });
// });