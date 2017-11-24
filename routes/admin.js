var express = require('express');
var router = express.Router();
var scripts = require('../models/script-m');

/* GET home page. */
router.get('/', function(req, res, next) {
  scripts.allScripts().then((ScriptsArray) => {
        console.log(ScriptsArray);
        res.render('admin', {
            title: 'Admin',
            scripts: ScriptsArray
        });
    });
});

router.post('/save', function(req, res, next) {
    // Make sure we have all of the data we want
    if (req.body.code) {
        var save;
        // Was this a create or update?
        if (req.body._id) {
            // An update
            save = scripts.update(
                req.body._id,
                req.body.code);
        }
        else {
            // A create
            save = scripts.create(req.body.code);
        }
        save.then(() => {
            res.redirect('/admin');
        }).catch((err) => {
            next(err);
        });
    }
    else {
        next(new Error('Not enough data supplied'));
    }
});

router.post('/delete/:id', function(req, res, next) {
  scripts.getScriptInfo(req.params.id).then((script) => {
    if (script === false) {
      next(new Error('Script Not Found'));
    } else {
        scripts.destroy(req.body._id).then(() => {
          res.redirect('/admin');
        });
    }
  });
});
module.exports = router;
