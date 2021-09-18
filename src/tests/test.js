const request = require('supertest');
var chai = require('chai');

var expect = chai.expect;
const app = require('../server');

describe('Creacion de usuario', function() {

    it('Deberia retornar error por tener una contraseña con longitud < a 8', done =>{
        request(app)
            .post('/users/create')
            .set('Accept', 'application/json')
            .send({
                username:  "usuario1", 
                password: "asdasd",
                firstname:  "nombre", 
                lastname: "apellido",
                preferedCurrency: "usd"
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                console.log(res.body);
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    }); 

    it('Deberia retornar error por no cumplir con los valores posibles de preferedCurrency (usd, eur o ars)', done =>{
        request(app)
            .post('/users/create')
            .set('Accept', 'application/json')
            .send({
                username:  "usuario111", 
                password: "asdasd123",
                firstname:  "nombre", 
                lastname: "apellido",
                preferedCurrency: "aaa"
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                console.log(res.body);
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    }); 

  });

describe('Login', function() {

    it('Deberia retornar, junto con los datos del usuario, el token de acceso.', done =>{
        request(app)
            .post('/users/login')
            .set('Accept', 'application/json')
            .send({ username: "usuario10", password: "123qweasd"})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                expect(res.body.token).to.be.an('string');
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    }); 


  });

describe('Obtengo las criptomonedas disponibles', function() {

    var token = null;
  
    before(function(done) {
      request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({ username: "usuario10", password: "123qweasd"})
        .end(function(err, res) {
          token = res.body.token; 
          done();
        });
    });
  
    it('Deberia recuperar un array con todas las criptomonedas disponibles', function(done) { 
      request(app)
        .get('/cryptos/getAll')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            expect(res.body).to.be.an('array');
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
  });

describe('Obtengo el top N de monedas del usuario', function() {

    var token = null;
  
    before(function(done) {
      request(app)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({ username: "usuario10", password: "123qweasd"})
        .end(function(err, res) {
          token = res.body.token; 
          done();
        });
    });
    
    it('Deberia retornar error por tener N mayor a 25', function(done) { 
      request(app)
        .post('/users/getTopNCryptos')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({ n: 26})
        .end(function(err, res) {
            console.log(res.body);
            expect(res.statusCode).to.be.equal(400);
            done();
        });
    });

    it('Deberia retornar error por tener un valor de order no admitido', function(done) { 
        request(app)
          .post('/users/getTopNCryptos')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ n: 25, order: "asce"})
          .end(function(err, res) {
              console.log(res.body);
              expect(res.statusCode).to.be.equal(400);
              done();
          });
      });

  });