var chai         = require('chai'),
	expect       = chai.expect,
	request      = require('request'),
	root         = require('find-root')()+'/app/',
    token_signin = require(root+'/controllers/token_signin');

require('chai').should();
require('colors');

describe('token_signin'.yellow, function(){

	describe('authentication function'.green, function(){

		it ('should return a promise',function(){
			var result = token_signin.test.authFn();
			expect(result)
			.to.have.property('then')
			.to.be.an.instanceof(Function);
			expect(result)
			.to.have.property('fail')
			.to.be.an.instanceof(Function);
		});
	});
		
});