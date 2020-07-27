var express = require('express');
var router = express.Router();
var moment = require('moment');
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
  if(result){
    const dn =moment(result.dataNascimento).format("DD/MM/YYYY");
    res.render('signo', { title: 'Signos', dn, result });

  }
  else{
    res.render('signo', { title: 'Signos', result});


  }
});

router.get('/celeb/:nome',  async function(req, res, next) {
  res.json(await pesquisa(req.params.nome));
});



module.exports = router;
