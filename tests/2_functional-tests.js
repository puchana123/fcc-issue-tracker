const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000);
    suite('POST: /api/issues/apitest', () => {
        // #1
        test('Create an issue with every field', () => {
            assert.fail();
        });
        // #2
        test('Create an issue with only required fields', () => {
            assert.fail();
        });
        // #3
        test('Create an issue with missing required fields', () => {
            assert.fail();
        });
    });
    suite('GET: /api/issues/apitest', () => {
        // #4
        test('View all issues on a project', () => {
            assert.fail();
        });
        // #5
        test('View issuses on a project with one filter', () => {
            assert.fail();
        });
        // #6
        test('View issuses on a project with mulitiple filters', () => {
            assert.fail();
        });
    });
    suite('PUT: /api/issues/apitest', () => {
        // #7
        test('Update one field on an issue', () => {
            assert.fail();
        });
        // #8
        test('Update multiple fields on an issue', () => {
            assert.fail();
        });
        // #9
        test('Update an issue with missing _id', () => {
            assert.fail();
        });
        // #10
        test('Update an issue with no fields to update', () => {
            assert.fail();
        });
        // #11
        test('Update an issue with an invalid _id', () => {
            assert.fail();
        });
    });
    suite('DELETE: /api/issues/apitest', () => {
        // #12
        test('Delete an issue', () => {
            assert.fail();
        });
        // #13
        test('Delete an issue with invalid _id', () => {
            assert.fail();
        });
        // #14
        test('Delete an issue with missing _id', () => {
            assert.fail();
        });
    });
});
