var express = require('express');
var router = express.Router();
const pesquisa = require('../services/pesquisa'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/celeb/:nome',  async function(req, res, next) {
  res.json(await pesquisa(req.params.nome));
});



module.exports = router;
