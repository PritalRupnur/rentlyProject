let chai = require('chai');
var assert = require('assert');
const userController = require('../src/controller/userController')
const server = require('../src/index')
const route = require('../src/index')
const db = require('../models/index')
const pg = require('pg');
const dbConfig = require("../config/config.json")['development']

const conString = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`;
const client = new pg.Client(conString);
client.connect();
const DatabaseCleaner = require('database-cleaner');

const databaseCleaner = new DatabaseCleaner('postgresql');
const sinon = require('sinon')
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
//The main describe block to empty the db.

function person (name, fullname) {
    this.name = name
    this.fullname = fullname
}

person.prototype.greetings = function () {
    return `Hello ${this.name} ${this.fullname}`
}


describe('Users', () => {
    
    beforeEach(async ()=>{
        let user = {
            name: "Sita",
            age: 21,
            email: "sita@gmail.com",
            gender: "Female"
        };

        const createUser = await db.sequelize.models.user.create(user)
       

    })

    afterEach((done) => { //Before each test we empty the database
        console.log("hi")
        databaseCleaner.clean(client, (err) => {

            done();
        });
    });


    //stub for practice
    describe('sample stub for practice', () => {


        it('should pass', (done) => {
            const name = new person("sita", "gita")
            name.greetings().should.eql("Hello sita gita")
            sinon.stub(person.prototype, 'greetings').returns("Hello everyone here")
            name.greetings().should.eql("Hello everyone here")
                done()


        })

    })


    //describe block for creating user
    describe('/createUser', () => {
        it('it should create a user with proper requirements', (done) => {
            let user = {
                name: "Kiran",
                age: 21,
                email: "kir@gmail.com",
                gender: "Female"
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

                    
                    if (err)
                    res.should.have.status(500);

                    done();

                });
        });
        // const stub = sinon.stub(Stub, greet)
    });



    //test the get user by id api
    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', async function () {
            let user = {
                name: "Sita",
                age: 21,
                email: "sita@gmail.com",
                gender: "Female"
            };

            const createUser = await db.sequelize.models.user.create(user)
            chai.request('http://localhost:3000')
                //console.log(createUser)
                .get('/getUsers/' + createUser.id)
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

    //describe to test the update api
    describe('/PUT/:id user', () => {
        it('it should UPDATE a user given the id', async function () {
            let user = ({
                name: "Alia",
                age: 21,
                email: "alia.b@gmail.com",
                gender: "Female"
            })
            const updateUser = await db.sequelize.models.user.create(user)


            chai.request('http://localhost:3000')
                .put('/updateUsers/' + updateUser.id)
                .send({
                    name: "Deepika",
                    age: 22,
                    email: "deepa.p@gmail.com",
                    gender: "Female"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User updated!');


                });

        });
    });

    //test casese for delete api.
    describe('/DELETE/:id book', () => {
        it('it should DELETE a book given the id', async function () {
            let user = ({
                name: "Alia",
                age: 21,
                email: "alia.b@gmail.com",
                gender: "Female"
            })
            const deleteUser = await db.sequelize.models.user.create(user)

            chai.request('http://localhost:3000')
                .delete('/deleteUsers/' + deleteUser.id)
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