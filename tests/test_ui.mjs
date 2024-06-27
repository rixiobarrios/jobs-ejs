// Now create a simple UI test case, in tests/test_ui.js:

// const chai = require('chai');
import chaiHttp from 'chai-http';
// chai.use(require('chai-http'));
const chai = use(chaiHttp);
// const { app, server } = require('../app');
import { app, server } from '../app.js';
// const expect = chai.expect;
import { expect, use } from 'chai';

describe('test getting a page', function () {
    after(() => {
        server.close();
    });
    it('should get the index page', (done) => {
        chai.request(app)
            .get('/')
            .send()
            .end((err, res) => {
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                expect(res).to.have.property('text');
                expect(res.text).to.include('Click this link');
                done();
            });
    });
});

// In this case, you get a res.text, instead of a res.body.  The text is the actual HTML sent back in response to the request, as a string.  Checking the string to see if the response was correct can be a little clumsy, as compared with checking the results of an API.  Anyway, verify that your tests still pass, by doing npm run test.  If you used slightly different wording in your page, you'll have to change the test above.
