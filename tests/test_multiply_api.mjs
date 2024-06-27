// Then create a test, a file tests/test_multiply_api.js, as follows:

// const chai = require('chai');
import chaiHttp from 'chai-http';
// chai.use(require('chai-http'));
const chai = use(chaiHttp);
// const { app, server } = require('../app');
import { app, server } from '../app.js';
// const expect = chai.expect;
import { expect, use } from 'chai';

describe('test multiply api', function () {
    after(() => {
        server.close();
    });
    it('should multiply two numbers', (done) => {
        chai.request(app)
            .get('/multiply')
            .query({ first: 7, second: 6 })
            .send()
            .end((err, res) => {
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('result');
                expect(res.body.result).to.equal(42);
                done();
            });
    });
});

// Note first of all that this file actually requires your app, which causes your app to run.  Chai is going to send data to that running app.  The chai-http package adds HTTP functions to Chai, so it now has the get() method (as well as post, patch, etc.), and these return a request object with methods query, send, and end. The end method has a callback that returns either an error or a result.  One can then check the result status and body.  Finally, each test must call done().  The server.close() ends the server.  Do npm run test to try it out.
