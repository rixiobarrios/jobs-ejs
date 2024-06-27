// const multiply = require('../utils/multiply');
import { multiply } from '../utils/multiply.mjs';
// const expect = require('chai').expect;
import { expect } from 'chai';

describe('testing multiply', () => {
    it('should give 7*6 is 42', (done) => {
        expect(multiply(7, 6)).to.equal(42);
        done();
    });
    // it('should give 7*6 is 42', (done) => {
    //     expect(multiply(7, 6)).to.equal(97);
    //     done();
    // });
    it('should give 5*5 is 25', (done) => {
        expect(multiply(5, 5)).to.equal(25);
        done();
    });
    it('should give 7*7 is 49', (done) => {
        expect(multiply(7, 7)).to.equal(49);
        done();
    });
});
