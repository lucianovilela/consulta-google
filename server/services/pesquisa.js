const axios = require("axios").default;
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");
const moment = require("moment");
const  pretty  = require("pretty");

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



const getDateNascimentoBing = async (nome) => {
  return await axios({url:`https://www.bing.com/search?q=${nome}&form=QBLH&sp=-1&pq=${nome}&sc=6-8&qs=n`, 
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }).then((res) => {
    const html = res.data;
    console.debug(pretty(html));

    var dataNascimento=undefined;
    var nomeGoogle = undefined;
    txt = html.match(/Nasceu:<\/span>\s(\d{1,2}\sde\s[jfmajsond]\w+\sde\s\d{4})/gim);
    if (txt) {
      dataNascimento= moment(txt[0], "DD MMM YYYY", "pt-br");
    }

    txt = html.match(/<h2\sclass=\"\sb_entityTitle\">([\w\s]+)<\/h2>/gim);
    if(txt){
      nomeGoogle=txt[0];
    }

    return {dataNascimento, nomeGoogle};
  });
};


const getDateNascimentoGoogle = async (nome) => {
  return await axios({
    
    url: `https://www.google.com/search?q=${nome}&rlz=1C1GCEU_pt-BRBR894BR894&ie=UTF-8`,
    method: "GET",
  }).then((res) => {
    let txt = html.match(/([jfajsondm]\w+\s\d+,\s\d+)[\s,]+/gim);
    var dataNascimento=undefined;
    var nomeGoogle = undefined;

    if (txt) {
      dataNascimento= moment(txt[0], "MMMM DD YYYY", "en");
    } else {
      txt = html.match(/(\d{1,2}\sde\s[jfmajsond]\w+\sde\s\d{4})/gim);
      if (txt) {
        dataNascimento= moment(txt[0], "DD MMMM YYYY", "pt-br");
      }
    }

    txt = html.match(/data\-attrid\=\"title\".+<span>([\w\s]+)<\/span>/gim);
    if(txt){
      nomeGoogle=txt[0];
    }

    return {dataNascimento, nomeGoogle};
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
      return {link:"https://images.unsplash.com/photo-1519400197429-404ae1a1e184?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1586&q=80"  }    
    }

};

const sanitize = (obj) => {
  return {
    ...obj, 
    nome:obj.nome
    .trim()
    .replace(/\s+/gim, " ")
    .replace(/[^\w\s\d]/gim, "")};
};
const pesquisa = async (_nome) => {
  const resultado = {
    nome:_nome,
    signo:undefined,
    dataNascimento:undefined,
    imagem:undefined,
  };

  const nome = sanitize(resultado).nome;

  let pesquisa = await db.consulta.findOne({ where: { nome: nome } });
  if (pesquisa) {
    return pesquisa;
  }

  let {dataNascimento, nomeGoogle} = await getDateNascimentoGoogle(nome);
  try {
    var signo = undefined;
    var photo = undefined;
    if(!nomeGoogle){
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
