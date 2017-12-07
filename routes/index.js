var express = require('express');
var router = express.Router();
var users = require('../models/user-m');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code Duel' });
});

router.post('/register', function(req, res, next) {
    // Make sure we have all of the data we want
    if (req.body.username) {
        var save;
        save = users.create(req.body.username, req.body.pass);
        
        save.then(() => {
            res.redirect('/');
        }).catch((err) => {
            next(err);
        });
    }
    else {
        next(new Error('Not enough data supplied'));
    }
});

module.exports = router;
