// process.env.NODE_ENV = 'test';
// let expect = require('chai').expect;
// let server = require("../server");
// const request = require('supertest');

// const wager = require('../routes/api/wager');
// const conn = require('../config/db');

// describe('Wager API', ()=>{
// before((done)=>{
//     conn.connect()
//     .then(()=>done())
//     .catch((err)=>done(err));
// })
// after((done) => {
//     conn.close()
//       .then(() => done())
//       .catch((err) => done(err));
//   })

//   it('creating a public wager', (done) => {
//     request(wager).post('/public')
//       .send({ game: 'fort', description: "box", amount: "1.00" })
//       .then((res) => {
//         const body = res.body;
//         expect(body).to.contain.property('game');
//         expect(body).to.contain.property('description');
//         expect(body).to.contain.property('amount');
//         done();
//       })
//       .catch((err) => done(err));
//   });

// //   it('Fail, note requires text', (done) => {
// //     request(wager).post('/public')
// //       .send({ game: undefined })
// //       .then((res) => {
// //         const body = res.body;
// //         expect(body.errors.text.name)
// //           .to.equal('ValidatorError')
// //         done();
// //       })
// //       .catch((err) => done(err));
// //   });
// //Test Creating a Wager for another user

// // describe('POST /api/wager',()=>{
// //     it('it should allow user to create a wager against another user',(done) => {
// //     chai.request(server)
// //     .post('/api/wager')
// //     .end((err,response)=>{
// //         response.should.have.status(200);
// //         done();
// //     })
// // })
// // })
// // Test Creating a Wager for the public


// //Test Get Wagers for a specific User


// //Test Get DisputedWagers for a specific User

// //Test Get CompletedWagers for a specific User


// //Test Get User by username


// //Test Canceling a public Wager

// //Test Canceling a private Wager

// // Test Declining a Wager

// // Test winning a Wager

// // test losing a Wager

// //test the on going wager the user is part of 

// //Test Accepting A private wager

// //Test Accepting A public wager


// //test sending a dispute form

// });