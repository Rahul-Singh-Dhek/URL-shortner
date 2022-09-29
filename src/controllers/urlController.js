const mongoose=require('mongoose')
const shortId=require('shortid')
console.log(shortId)




const shorturl=async function(req,res){
    console.log(req.body)
    let urlCode=shortId.generate();






    return res.send({msg:`http://localhost:3000/${urlCode}`})
}

module.exports.shorturl=shorturl