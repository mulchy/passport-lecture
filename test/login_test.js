var request = require('supertest');
var expect = require('chai').expect;
var User = require('../models/user');

describe('testing server login', function() {

    var server;
    beforeEach(function () {
	server = require('../server');
    });
    afterEach(function () {
	server.close();
    });


    it('should show the user the log in page at the root url', function(done) {
	request(server)
	    .get('/')
	    .expect(200, done);
    });


    describe('login tests', function() {
	before('remove all users', function(done) {
	    User.remove({}, function(err) {
		done();
	    });
	});
	
	before('create a user', function(done){
	    request(server)
		.post('/register')
		.send({username: 'ryan', password:'password1'})
		.expect(302)
		.expect('Location', '/', done);
	});
	
	it('should log a user in with the correct credentials', function (done){
	    request(server)
		.post('/login')
		.send({username: 'ryan', password:'password1'})
		.expect(302)
		.expect('Location', 'views/success.html', done);
	});
    });
});
