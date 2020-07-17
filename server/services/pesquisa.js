const axios = require("axios").default;
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const moment = require('moment');




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

const getSigno = (d) => {
  for (const o of SIGNOS) {
    dia = d.month() * 100 + d.day();
    if (
      dia >= o["meses"][0] * 100 + o["dias"][0] &&
      dia <= o["meses"][1] * 100 + o["dias"][1]
    ) {
      return o;
    }
  }
};
const getComplemento =async  (nome) => {
  try {
    return { nomewiki: nome, imagem: await getPhotos(nome) };
  } catch (e) {
    console.error(e);
    return { exception: "nao encontrado" };
  }
};
const getDateNascimento = async (nome) => {
  return await axios({
    url: `https://www.google.com/search?q=${nome}`,
    method: "GET",
  }).then((res) => {
    const html = res.data;
    let txt =html.match(/([jfajsondm]\w+\s\d+,\s\d+)[\s,]+/gmi);
    if (!txt) {
      txt = html.match(/(\d{1,2}\sde\s[jfmajsond]\w+\sde\s\d{4})/gmi);
    }
    if (txt) {
      const dt = moment(txt[0],"DD  MMMM  YYYY", "pt-br");
      return dt;
    }
  });
};


const  getPhotos=async (nome)=>{
  
  const res = await customsearch.cse.list({
      q:nome,
      cx:process.env.cx,
      searchType:'image',
      num:1,
      imgType:'photo',
      fileType:'png',
      safe:'off',
      auth:process.env.developerKey
      });
      return res.data;

}        

const sanitize= (str)=>{
  return escape(str.trim().replace(/\s+/gmi, " "));
}
const pesquisa=async (_nome)=>{
  const nome=sanitize(_nome);
  console.debug(nome);
  const dt = await getDateNascimento(nome);
  let signo={}
  if(dt){
     signo = getSigno(dt);
  }
  const complemento = await getComplemento(nome);
  //const complemento={};
  return ({nome:nome, 
    signo:signo,
    dataNascimento:dt, 
  complemento:complemento});
}

module.exports = pesquisa;
