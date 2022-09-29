const express=require('express')
const urlcontroller=require('../controllers/urlController.js')
const router=express.Router()


router.post('/url/shorten',urlcontroller.shorturl)

router.get('/test-me',function(req,res){
    return res.send({msg:"working fine , coll hai"})
})



















module.exports=router