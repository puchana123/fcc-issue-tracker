'use strict';

const { default: mongoose, Schema } = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

// connect to mongodb
mongoose.connect(url);

// create Schema
const IssueSchema = new Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_on: Date,
  update_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String
});

// create model
const Issue = new mongoose.model('Issue', IssueSchema);

module.exports = function (app) {
  // default '/api/issues/apitest'
  app.route('/api/issues/:project')

    // get data
    .get(function (req, res) {
      let project = req.params.project;
      res.json(req.body);
    })
    // add new data
    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      // add new issue
      const new_issue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: new Date(),
        update_on: new Date(),
        open: true
      });
      const saved = await new_issue.save();
      res.send({
        _id: saved._id,
        issue_title: saved.issue_title,
        issue_text: saved.issue_text,
        created_on: saved.created_on,
        update_on: saved.update_on,
        created_by: saved.created_by,
        assigned_to: saved.assigned_to,
        status_text: saved.status_text,
        open: saved.open
      });
      console.log('add new issue succesfull');
    })
    // update exist data
    .put(function (req, res) {
      let project = req.params.project;
      res.json(req.body);
    })
    // delete exist data
    .delete(function (req, res) {
      let project = req.params.project;
      res.json(req.body);
    });

};
