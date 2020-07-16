var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signo', function(req, res, next) {
  res.render('signo', { title: 'signo' });
});



module.exports = router;
