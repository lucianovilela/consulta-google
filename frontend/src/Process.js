const parseDatadeNascimento = str => {
  //
  //format dd mmmm yyyy
  //
  let regexs = [/(\d+)\s+(\w+)\s(\d{2,4})/gi, /(\w+)\s(\d{1,2}),\s(\d{2,4})/gi];
  var retorno;
  regexs.forEach(regex => {
    let r = regex.exec(str);
    if (r) {
      let d = new Date(r[0]);
      retorno = !isNaN(d) ? d : "";
      return retorno;
    }
  });
  return retorno;
};

const parseDataGoogle = str => {
  let regexs = [
    /kc:\/people\/person:born.*>(\d{1,2}\sde\s[\wç]+\sde\s\d{2,4})/gi
  ];
  var retorno;
  regexs.forEach(regex => {
    let r = regex.exec(str);
    if (r) {
      let d = new Date(r[0]);
      retorno = !isNaN(d) ? d : "";
      return retorno;
    }
  });
  return retorno;
};
export default parseDataGoogle;
