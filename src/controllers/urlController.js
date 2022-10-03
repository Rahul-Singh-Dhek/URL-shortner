const mongoose = require('mongoose')
const shortId = require('shortid')
// const validURL = require('valid-url')
const urlModel = require('../models/urlModel')
const redis = require('redis')
const { promisify } = require("util");


const redisClient = redis.createClient(
    13960,
    "redis-13960.c276.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);

redisClient.auth("NQpIjO7ZCxuRi3APtBd1ppZmfFbFTmQP", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const shorturl = async function (req, res) {
    // try {
        let longUrl = req.body.longUrl
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "Please provide longUrl" })
        }
        if (typeof longUrl !== "string") {
            return res.status(400).send({ status: false, message: "longUrl must be in String" })
        }
        longUrl = longUrl.trim().toLowerCase()

        let gau = longUrl.startsWith("http://") || longUrl.startsWith("https://") || longUrl.startsWith("ftp://")
        if (!gau) {
            return res.status(400).send({ status: false, message: "Please provide valid LongUrl" })
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        let catchedUrldata = await GET_ASYNC(`${longUrl}`)

        if (catchedUrldata) {
            return res.status(200).send({ status: true, message: "ShortUrl is already created for this URL(REDIS)", data: JSON.parse(catchedUrldata) })
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       

        let url = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })
        if (url) {
            await SET_ASYNC(`${longUrl}`,JSON.stringify(url))//stringify converts objects into string
            //Redis consider only string
            return res.status(200).send({ status: true, message: "ShortUrl is already created for this URL", data: url })
        }

        let urlCode = shortId.generate();
        let baseUrl = "http://localhost:3000/"
        let shortUrl = baseUrl + urlCode;

        let savedData = await urlModel.create({ urlCode: urlCode, longUrl: longUrl, shortUrl: shortUrl })

        return res.status(201).send({
            status: true, message: "ShortUrl Generated Successfully", data: {
                urlCode: savedData.urlCode,
                longUrl: savedData.longUrl,
                shortUrl: savedData.shortUrl
            }
        })
    // }
    // catch (err) {
    //     return res.status(500).send({ status: true, message: err })
    // }
}

const geturl = async function (req, res) {
    if (!shortId.isValid(req.params.urlCode.trim())) {
        return res.status(400).send({ status: false, message: "Please provide valid urlCode" })
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let catchedUrldata = await GET_ASYNC(`${req.params.urlCode.trim()}`)
    // console.log(catchedUrldata)
    if (catchedUrldata) {
        console.log("I am in")
        return res.status(302).redirect(JSON.parse(catchedUrldata).longUrl)
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    const url = await urlModel.findOne({ urlCode: req.params.urlCode.trim() })
    if (url) {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        await SET_ASYNC(`${req.params.urlCode.trim()}`, JSON.stringify(url))
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        return res.status(302).redirect(url.longUrl)
    } else {
        return res.status(400).send({ status: false, message: "No documnet found with this urlCode" });
    }
}

module.exports = { shorturl, geturl }