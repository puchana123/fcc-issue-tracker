const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const api_url = '/api/issues/apitest123';

chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000);
    suite('POST: /api/issues/apitest', () => {
        // #1
        test('Create an issue with every field', () => {
            chai
                .request(server)
                .keepOpen()
                .post(api_url)
                .send({
                    issue_title: 'Api_test1',
                    issue_text: 'this is an api test #1',
                    created_by: 'ApiTester',
                    assigned_to: 'ApiTester',
                    status_text: 'test'
                })
                .end((err,res)=>{
                    const output = res.body
                    assert.equal(res.status, 200, 'api should response');
                    assert.isObject(output,'output should be Object');
                    assert.equal(output.issue_title, 'Api_test1');
                    assert.equal(output.issue_text, 'this is an api test #1');
                    assert.equal(output.created_by, 'ApiTester');
                    assert.equal(output.assigned_to, 'ApiTester');
                    assert.equal(output.status_text, 'test');
                    assert.property(output, 'created_on');
                    assert.property(output, 'updated_on');
                    assert.property(output, '_id');
                })
        });
        // #2
        test('Create an issue with only required fields', () => {
            chai
                .request(server)
                .keepOpen()
                .post(api_url)
                .send({
                    issue_title: 'Api_test2',
                    issue_text: 'this is an api test #2',
                    created_by: 'ApiTester',
                })
                .end((err,res)=>{
                    const output = res.body
                    assert.equal(res.status, 200, 'api should response');
                    assert.isObject(output,'output should be Object');
                    assert.equal(output.issue_title, 'Api_test2');
                    assert.equal(output.issue_text, 'this is an api test #2');
                    assert.equal(output.created_by, 'ApiTester');
                    assert.property(output,'assigned_to');
                    assert.property(output, 'status_text');
                    assert.property(output, 'created_on');
                    assert.property(output, 'updated_on');
                    assert.property(output, '_id');
                })
        });
        // #3
        test('Create an issue with missing required fields', () => {
            chai
                .request(server)
                .keepOpen()
                .post(api_url)
                .send({
                    assigned_to: 'ApiTester',
                    status_text: 'test'
                })
                .end((err,res)=>{
                    const output = res.body
                    assert.equal(res.status, 200, 'api should response');
                    assert.isObject(output,'output should be Object');
                    assert.property(output,'error');
                    assert.equal(output.error, 'required field(s) missing');
                })
        });
    });
    suite('GET: /api/issues/apitest', () => {
        // #4
        test('View all issues on a project', () => {
            chai
                .request(server)
                .keepOpen()
                .get(api_url)
                .end((err,res)=>{
                    const output = res.body
                    assert.equal(res.status, 200, 'api should response');
                    assert.equal(res.type, "application/json");
                    assert.isArray(output, 'output is array of object');
                })
        });
        // #5
        test('View issuses on a project with one filter', () => {
            chai
            .request(server)
            .keepOpen()
            .get(api_url)
            .query({'issue_title':'Api_test1'})
            .end((err,res)=>{
                const output = res.body
                assert.equal(res.status, 200, 'api should response');
                assert.equal(res.type, "application/json");
                assert.isArray(output, 'output is array of object');
                assert.equal(output[0].issue_title, 'Api_test1' ,'filter with issue_title');
            })
        });
        // #6
        test('View issuses on a project with mulitiple filters', () => {
            chai
            .request(server)
            .keepOpen()
            .get(api_url)
            .query({
                'issue_title':'Api_test1',
                'status_text': 'test'
            })
            .end((err,res)=>{
                const output = res.body
                assert.equal(res.status, 200, 'api should response');
                assert.equal(res.type, "application/json");
                assert.isArray(output, 'output is array of object');
                assert.equal(output[0].issue_title, 'Api_test1' ,'filter with issue_title');
                assert.equal(output[0].status_text, 'test' ,'filter with status_text');
            })
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
