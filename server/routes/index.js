var express = require("express");
var router = express.Router();
var moment = require("moment");
const pesquisa = require("../services/pesquisa");
const like = require("../services/like");

const db = require("../models/index");


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

module.exports = router;
