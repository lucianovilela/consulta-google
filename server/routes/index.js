var express = require("express");
var router = express.Router();
var moment = require("moment");
const pesquisa = require("../services/pesquisa");
const like = require("../services/like");

const db = require("../models/index");
const { google } = require("googleapis");

const customsearch = google.customsearch("v1");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { result: null });
});
/* GET home page. */
router.get("/signo", async function (req, res, next) {
  let result = undefined;
  if (req.query.nome) {
    result = await pesquisa(req.query.nome);
  }
  if (result) {
    const dn = moment(result.dataNascimento).format("DD/MM/YYYY");
    res.render("index", { title: "Signos", dn, result });
  } else {
    res.render("index", { title: "Signos", result });
  }
});

router.get("/celeb", async function (req, res) {
  if (req.query.nome) {
    res.json(await pesquisa(req.query.nome));
  }
});

router.get("/list", async (req, res)=>{
  db.consulta.findAndCountAll({
    limit:10,
    offset:(req.query.pg*10)||0,
    order:['nome']
  }).then((result)=>{
    res.json(result);
  });
});

router.put("/like", async (req, res) => {
  like(req.query.id, "like")
    .then((result) => res.json(result))
    .catch((error) => {
      res.status(500).json(error);
    });
});
router.put("/dislike", async (req, res) => {
  like(req.query.id, "like")
    .then((result) => res.json(result))
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.get("/teste", async (req, res)=>{
    res.send( await customsearch.cse.list({
      q: req.query.q,
      cx: process.env.cx,
      num: 10,
      safe: "off",
      auth: process.env.developerKey,
      siteSearch:"wikipedia.com",
      siteSearchFilter:"i"
    })
    .catch(e=>JSON.stringify(e)));




});

const wiki =require('wikijs').default;
// const wiki = require('wikijs').default;



router.get("/testeWiki", async (req, res)=>{
    res.send( await wiki().find(req.query.q)
    .then(async page => ({'info':await page.info(), 'imagem':await page.mainImage()}) )
    .catch(e=>JSON.stringify(e)));

});




module.exports = router;
