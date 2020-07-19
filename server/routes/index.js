var express = require('express');
var router = express.Router();
const pesquisa = require('../services/pesquisa'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET home page. */
router.get('/signo', async function(req, res, next) {
  let result=undefined;
  if(req.query.nome){
     result= await pesquisa(req.query.nome);
  }
  res.render('signo', { title: 'Signos', result:result });
});

router.get('/celeb/:nome',  async function(req, res, next) {
  res.json(await pesquisa(req.params.nome));
});



module.exports = router;
