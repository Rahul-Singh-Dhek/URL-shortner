const express=require('express')
const urlcontroller=require('../controllers/urlController.js')
const router=express.Router()


router.post('/url/shorten',urlcontroller.shorturl)


router.get('/:urlCode',urlcontroller.geturl)



















module.exports=router