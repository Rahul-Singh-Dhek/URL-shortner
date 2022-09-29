const mongoose = require('mongoose')
const shortId = require('shortid')
const validURL = require('valid-url')
const urlModel=require('../models/urlModel')
// console.log(shortId)


const shorturl = async function (req, res) {

    let longUrl = req.body.longUrl
    if (typeof longUrl!=="string")
        {
        return res.status(400).send({status:false,message:"longurl must be string"})
        }
    if (!validURL.isUri(longUrl))

        {
        return res.status(400).send({status:false,message:"please provide a valid url"})
        }
    
    console.log(validURL.isUri(longUrl))



    if (!validURL.isUri(longUrl)) 
    {
        return res.send({ msg: "Not a valid URL" })
    }


    let urlCode = shortId.generate();
    let shortUrl="http://localhost:3000/"+urlCode;
    let savedData=await urlModel.create({urlCode:urlCode,longUrl:longUrl,shortUrl:shortUrl})


    return res.send({ data:savedData }) 
}

const geturl=async function(req,res){
const url=await urlModel.findOne({urlCode:req.params.urlCode})
if(url){
    
    return res.status(302).redirect(url.longUrl)
}else{
    return res.send({msg:"No url found"});
}

    
}

module.exports = {shorturl,geturl}