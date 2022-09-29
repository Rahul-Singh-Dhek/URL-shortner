const mongoose = require('mongoose')
const shortId = require('shortid')
const validURL = require('valid-url')
const urlModel = require('../models/urlModel')
// console.log(shortId)


const shorturl = async function (req, res) {

    let longUrl = req.body.longUrl
    if (typeof longUrl !== "string") {
        return res.status(400).send({ status: false, message: "longUrl must be in String" })
    }
    if (!validURL.isUri(longUrl)) {
        return res.status(400).send({ status: false, message: "Please provide a valid URL" })
    }
    let url = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })
    if (url) {
        return res.status(200).send({ status: true, data: url })
    }

    let urlCode = shortId.generate();
    let shortUrl = "http://localhost:3000/" + urlCode;
    let savedData = await urlModel.create({ urlCode: urlCode, longUrl: longUrl, shortUrl: shortUrl })
    return res.status(201).send({
        status: true, data: {
            urlCode: savedData.urlCode,
            longUrl: savedData.longUrl,
            shortUrl: savedData.shortUrl
        }
    })

}

const geturl = async function (req, res) {
    console.log(typeof req.params.urlCode)
    if (!shortId.isValid(req.params.urlCode)) {
        return res.status(400).send({ status: false, message: "Please provide valid urlCode" })
    }
    const url = await urlModel.findOne({ urlCode: req.params.urlCode })
    if (url) {
        return res.status(302).redirect(url.longUrl)
    } else {
        return res.status(400).send({ status: false, message: "No documnet found with this urlCode" });
    }
}

module.exports = { shorturl, geturl }