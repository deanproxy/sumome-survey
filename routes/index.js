var models = require('../models');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var sequelize = require('sequelize');
var _ = require('lodash');

function loginMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/* Login/Logout routes. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/jsonLoginSuccess', function(req, res) {
  res.sendStatus(200);
});
router.get('/jsonLoginFailure', function(req, res) {
  res.sendStatus(401);
});
router.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/jsonLoginSuccess',
    failureRedirect: '/jsonLoginFailure',
    falureFlash: true
  })
);
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* Admin routes */
router.get('/admin', loginMiddleware, function(req, res) {
  res.render('admin', {user: req.user});
});
router.get('/admin/questions', loginMiddleware, function(req, res) {
  models.Question.findAll({
    include: [models.Option],
    order: 'createdAt DESC'
  }).then(function(questions) {
    const json = questions.map(q => q.toJSON());
    res.json(json);
  });
});
router.post('/admin/question', loginMiddleware, function(req, res) {
  models.Question.create({
    title: req.body.title
  }).then(function(question) {
    _.each(req.body.options, option => {
      console.log(`Creating option ${option.title}`);
      models.Option.create({
        title: option.title,
        QuestionId: question.id
      });
    });
    res.sendStatus(200);
  });
});
router.put('/admin/question/:id', loginMiddleware, function(req, res) {

  function eachEdit(opt) {
    models.Option.findById(opt.id)
      .then(option => {
        console.log(`Found option ${option.id}`);
        option.title = opt.title;
        option.save();
      });
  }

  models.Question.findById(req.params.id)
    .then(function(question) {
      question.title = req.body.title;
      var edits = req.body.options.filter(opt => opt.id);
      var additions = req.body.options.filter(opt => !opt.id);
      _.each(edits, eachEdit);
      _.each(additions, option => {
        models.Option.create({
          title: option.title,
          QuestionId: question.id
        });
      });
      res.json(question.toJSON());
    });
})
router.delete('/admin/question/:id', loginMiddleware, function(req, res) {
  models.Question.findById(req.params.id)
    .then(function(question) {
      question.destroy().then(function(question) {
        res.json(question.toJSON());
      });
    });
});


/* Main routes. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/question', function(req, res) {
  /* Find all questions they have already answered. */
  models.SessionQuestionMap.findAll({
    where: {
      sessionId: req.sessionID
    }
  }).then(result => {
    /* Find a random question to send as long as they haven't already answered it */
    const results = result.map(i => i.QuestionId);
    const options = {
      include: [models.Option],
      order: [
        sequelize.fn('RAND')
      ]
    }
    if (results.length) {
      options.where = {
        id: {
          not: results
        }
      }
    }
    models.Question.find(options).then(result => {
      if (result) {
        res.json(result.toJSON());
      } else {
        res.json({});
      }
    });
  });
});
router.post('/question/:id', function(req, res) {
  /* Does this question exist? */
  models.Question.findById(req.params.id)
    .then(function(question) {
      if (!question) {
        res.sendStatus(404);
      } else {
        /* It does. Let's map it to the session id... */
        models.SessionQuestionMap.create({
          sessionId: req.sessionID,
          questionId: req.params.id
        }).then(function(sqmap) {
          /* Now it's mapped to the session id, update the selected option count. */
          models.Option.findById(req.body.optionId)
            .then(function(option) {
              if (option) {
                option.selected++;
                option.save().then(function() {
                  res.sendStatus(200);
                });
              }
            });
        });
      }
    });
});


module.exports = router;
