//Server JS

//Base Set Up

//Call the package
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Connect mongodb
mongoose.connect('mongodb://localhost/restful-express-node', function(err) {
  if (err) {
    console.log('Connection error!', err);
  }
  console.log('Connection succesfull');
});
//Import models
var User = require('./app/models/user')


//Configure app to use bodyparser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT | 8080;

//Routes for API
var router = express.Router();

//Middleware to use for all request
router.use(function(req, res, next) {
  //do logging
  console.log('Something is happening.');
  next();
});

//Route Users that end in /users
router.route('/users')

  //Create a bear
  .post(function(req, res) {
    var user = new User();
    user.name = req.body.name;

    //Save the bear and check for error
    user.save(function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'User created!', data: user});
    });
  })

  //Get all the users
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
  });

//Routes that end ini /users/:user_id
router.route('/users/:user_id')
  //Get the user with that id
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  })

  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.send(err);
      }
      user.name = req.body.name;

      user.save(function(err, user) {
        if(err) {
          res.send(err);
        }
        res.json({message: 'User updated!'});
      });
    });
  })

  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Successfully deleted'});
    });
  });

//Register our Routes
//All routes will b prefixed with /api
app.use('/api', router);

//Start the Server
app.listen(port);
console.log('Server running at ' + port);
