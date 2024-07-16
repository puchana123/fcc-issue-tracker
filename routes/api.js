'use strict';

const { default: mongoose, Schema } = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

// connect to mongodb
mongoose.connect(url);

// create Schema
const IssueSchema = new Schema({
  project_id: { type: String, require: true },
  issue_title: { type: String, require: true },
  issue_text: { type: String, require: true },
  created_on: Date,
  updated_on: Date,
  created_by: { type: String, require: true },
  assigned_to: String,
  open: Boolean,
  status_text: String
});
const projectSchema = new Schema({
  name: { type: String, require: true }
})

// create model
const Issue = new mongoose.model('Issue', IssueSchema);
const Project = new mongoose.model('Project', projectSchema);

module.exports = function (app) {
  // default '/api/issues/apitest'
  app.route('/api/issues/:project')

    // get data ------------------------------------------------
    .get(async function (req, res) {
      let project = req.params.project;
      // find project's name
      const exist_project = await Project.findOne({ name: project });
      if (!exist_project) {
        res.send('Not an exist project');
        return;
      };
      // req.query get object as optional
      const filter = req.query;
      filter.project_id = exist_project._id;
      const data = await Issue.find(filter).select('-__v -project_id');
      res.json(data);
      console.log(`get data from ${project}'s project`);
    })
    // add new data --------------------------------------------
    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ "error": "required field(s) missing" });
        return;
      }
      // find exist project
      let found_project = await Project.findOne({ name: project });
      // not found add new project
      if (!found_project) {
        const new_project = new Project({
          name: project
        });
        found_project = await new_project.save();
      }
      // add new issue
      const new_issue = new Issue({
        project_id: found_project._id,
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      });
      // get data from save() function & send back to user
      const saved = await new_issue.save();
      res.json({
        assigned_to: saved.assigned_to,
        status_text: saved.status_text,
        open: saved.open,
        _id: saved._id,
        issue_title: saved.issue_title,
        issue_text: saved.issue_text,
        created_by: saved.created_by,
        created_on: saved.created_on,
        updated_on: saved.updated_on,
      });
      console.log('add new issue succesfull');
    })
    // update exist data ----------------------------------------
    .put(async function (req, res) {
      let project = req.params.project;
      // get form data
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      // if no _id input
      if (!_id) {
        res.json({ 'error': 'missing _id' });
        return;
      };
      // if no update data
      if (!issue_text && !issue_title && !created_by && !assigned_to && !status_text && !open) {
        res.json({ 'error': 'no update field(s) sent', '_id': _id });
        console.log(`could not update id:${_id} (no update fields)`);
        return;
      };
      try {
        // find an exist project
        const exist_project = await Project.findOne({ name: project });
        if (!exist_project) {
          res.send('Not an exist project');
        };
        // findone and update exist issue
        const update_issue = await Issue.findByIdAndUpdate(_id, { ...req.body, updated_on: new Date() });
        await update_issue.save();
        res.json({ 'result': 'successfully updated', '_id': _id });
        console.log(`successfully updated id:${_id}`);
      } catch (err) {
        res.json({ error: 'could not update', '_id': _id });
        console.log(`could not update id:${_id} (other error)`);
      }
    })
    // delete exist data ----------------------------------------
    .delete(async function (req, res) {
      let project = req.params.project;
      // get _id from form
      const { _id } = req.body;
      if (!_id) {
        res.json({ 'error': 'missing _id' });
        return;
      };
      try {
        // check exist project
        const exist_project = await Project.findOne({ name: project });
        if (!exist_project) {
          res.json({ 'error': 'not an exist project' });
          return;
        };
        // delete
        const deleted_Result = await Issue.deleteOne({ _id: _id });
        if (deleted_Result.deletedCount === 0) {
          throw "not found issue's id" // throw custom error 
        };
        res.json({ 'result': 'successfully deleted', '_id': _id });
        console.log(`successfully deleted id:${_id}`);
      } catch (err) {
        res.json({ 'error': 'could not delete', '_id': _id });
        console.log(`could not delete id:${_id}`);
      }
    });

};
