'use strict';

const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

const  getPhotos=(nome)=>{
    const res = await customsearch.cse().list({
        q:nome,
        cx:process.env.get("cx"),
        searchType:'image',
        num:3,
        imgType:'photo',
        fileType:'png',
        safe:'off',
        auth:process.env.get("developerKey")
        }).execute();

        return res.data;

}        

module.exports = getPhotos;