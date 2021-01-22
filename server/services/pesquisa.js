const axios = require("axios").default;
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");
const moment = require("moment");
const pretty = require("pretty");

const db = require("../models/index");
const SIGNOS = [
  { signo: "Aquário", meses: [1, 2], dias: [20, 18] },
  { signo: "Peixes", meses: [2, 3], dias: [19, 20] },
  { signo: "Áries", meses: [3, 4], dias: [21, 19] },
  { signo: "Touro", meses: [4, 5], dias: [20, 20] },
  { signo: "Gêmeos", meses: [5, 6], dias: [21, 21] },
  { signo: "Câncer", meses: [6, 7], dias: [22, 22] },
  { signo: "Leão", meses: [7, 8], dias: [23, 22] },
  { signo: "Virgem", meses: [8, 9], dias: [23, 22] },
  { signo: "Libra", meses: [9, 10], dias: [23, 22] },
  { signo: "Escorpião", meses: [10, 11], dias: [23, 21] },
  { signo: "Sagitário", meses: [11, 12], dias: [22, 21] },
  { signo: "Capricórnio", meses: [12, 12], dias: [19, 31] },
  { signo: "Capricórnio", meses: [1, 1], dias: [1, 19] },
];

const getSigno = (dataNascimento) => {
  for (const o of SIGNOS) {
    dia = (dataNascimento.month() + 1) * 100 + dataNascimento.date();
    if (
      dia >= o["meses"][0] * 100 + o["dias"][0] &&
      dia <= o["meses"][1] * 100 + o["dias"][1]
    ) {
      return o;
    }
  }
};

const getDateNascimentoGoogle = async (nome) => {
  return await axios({
    url: `https://www.google.com/search?q=${nome}&ie=UTF-8`,
    method: "GET",
  }).then((res) => {
    var html = res.data;
    let txt = html.match(/([jfajsondm]\w+\s\d+,\s\d+)[\s,]+/gim);
    var dataNascimento = undefined;
    var nomeGoogle = undefined;

    if (txt) {
      dataNascimento = moment(txt[0], "MMMM DD YYYY", "en");
    } else {
      txt = html.match(/(\d{1,2}\sde\s[jfmajsond]\w+\sde\s\d{4})/gim);
      if (txt) {
        dataNascimento = moment(txt[0], "DD MMMM YYYY", "pt-br");
      }
    }

    txt = html.match(/data\-attrid\=\"title\".+<span>([\w\s]+)<\/span>/gim);
    if (txt) {
      nomeGoogle = txt[0];
    }

    return { dataNascimento, nomeGoogle };
  });
};

const getPhotos = async (nome) => {
  try {
    const obj = await customsearch.cse.list({
      q: nome,
      cx: process.env.cx,
      searchType: "image",
      num: 1,
      imgType: "photo",
      fileType: "png",
      safe: "off",
      auth: process.env.developerKey,
    });

    return obj.data.items[0];
  } catch (error) {
    return {
      link:
        "https://images.unsplash.com/photo-1519400197429-404ae1a1e184?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1586&q=80",
      error: error,
    };
  }
};
function retira_acentos(str) {
  let com_acento =
    "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

  let sem_acento =
    "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
  let novastr = "";
  for (i = 0; i < str.length; i++) {
    let troca = false;
    for (a = 0; a < com_acento.length; a++) {
      if (str.substr(i, 1) == com_acento.substr(a, 1)) {
        novastr += sem_acento.substr(a, 1);
        troca = true;
        break;
      }
    }
    if (troca == false) {
      novastr += str.substr(i, 1);
    }
  }
  return novastr;
}
const sanitize = (nome) => {
  return retira_acentos(
      nome
      .trim()
      .toLowerCase()
      .replace(/\s+/gim, " "));
}


const pesquisa = async (_nome) => {

  const nome = sanitize(_nome);

  let pesquisa = await db.consulta.findOne({ where: { nome: nome } });
  if (pesquisa) {
    return pesquisa;
  }

  let { dataNascimento, nomeGoogle } = await getDateNascimentoGoogle(nome);
  try {
    var signo = undefined;
    var photo = undefined;
    if (!nomeGoogle) {
      nomeGoogle = nome;
    }
    if (dataNascimento) {
      signo = await getSigno(dataNascimento);
      photo = await getPhotos(nomeGoogle);
    }
    pesquisa = await db.consulta.create({
      nome: nomeGoogle,
      signo: signo.signo,
      dataNascimento: dataNascimento,
      imagem: photo.link,
    });
    return pesquisa;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = pesquisa;
