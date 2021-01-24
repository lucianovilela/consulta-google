
const db = require("../models/index");

const  like=async (id, coluna)=>{
    const consulta= await db.consulta.findByPk(id);
    if(consulta){
        await consulta.increment(coluna, {by:1});
        return consulta;
    }
    throw new Error("id nao existe");
 

}


 
module.exports= like ;