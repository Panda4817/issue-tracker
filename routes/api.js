'use strict';
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app, db) {
  app.route('/:project/')
    .get(function (req, res) {
      const projects = {}
      db.find().toArray(function (err, result) {
        if (err) throw err
        result.map(issue => {
          if (!projects.hasOwnProperty(issue.project_title)) {
            projects[issue.project_title] = 1;
          } else {
            projects[issue.project_title]++;
          }
        })
        res.render(process.cwd() + '/views/issue.pug', {
          projects: projects
        });
        
      });
      
    });


  app.route('/')
    .get(function (req, res) {
      const projects = {}
      db.find({}).toArray(function (err, result) {
        if (err) throw err
        result.map((issue) => {
          if (!projects.hasOwnProperty(issue.project_title)) {
            projects[issue.project_title] = 1;
          } else {
            projects[issue.project_title]++;
          }
          return;
        })
        res.render(process.cwd() + '/views/index.pug', {
            projects: projects,
            num: Object.keys(projects).length
        });
      })
      
    });

  const isEmpty = value => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const obs = req.query;
      console.log(obs);
      Object.keys(obs).forEach(key => {
        if (key == 'open') {
          if (obs[key] == 'false'){
            obs[key] = false;
          } else {
            obs[key] = true;
          }
        }
      })
      obs['project_title'] = project;
      db.find(obs).sort( { updated_on: -1 } ).toArray(function (err, result) {
        if (err) throw err
        res.send(result);
      })
      
    })
    
    .post(function (req, res){
      const project = req.params.project;
      if (isEmpty(req.body.project_name) || isEmpty(req.body.issue_title) || isEmpty(req.body.issue_text)) {
        res.json({'error': 'required fields NOT filled in'})
      } else {
        db.insertOne({
        project_title: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true
      }, (err, doc) => {
        if (err) {throw err} else {
          res.json(doc.ops[0])
        }
        
      })
      }
      
      
    })

    
    .put(function (req, res){
      const project = req.params.project;
      const updatedFields = {};
      console.log(req.body)
      Object.keys(req.body).forEach(key => {
        if (key == 'open') {
          if (req.body[key] == 'false'){
            req.body[key] = false;
          } else {
            req.body[key] = true;
          }
        }
        if (!isEmpty(req.body[key]) && key != 'project_name' && key != '_id') {
          updatedFields[key] = req.body[key];
        }
      });
      if (Object.keys(updatedFields).length == 0) {
        res.json({'error': 'no updated field sent'})
      } else {
        updatedFields['updated_on'] = new Date();
        console.log(updatedFields)
        db.findOneAndUpdate({_id: new ObjectId(req.body._id)}, {
          $set : updatedFields
        }, (err, doc) => {
          if(err) {
            res.json({'failed': 'could not update ' + req.body._id})
          } else {
            res.json({'success': 'sucessfully updated '+req.body._id});
          }
          
        })
      }
      
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      if (!req.body._id) {
        res.json({'error': 'id error'})
      } else {
        db.findOneAndDelete({_id: new ObjectId(req.body._id)}, function(err, doc) {
        if(err) {
          res.json({'failed': 'could not delete ' + req.body._id})
        } else {
          res.json({'success': 'deleted '+req.body._id});
        }
        
      })
      }
      
    });
    
};
