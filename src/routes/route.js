const express = require("express");
const urlcontroller = require("../controllers/urlController.js");
const router = express.Router();

router.post("/url/shorten", urlcontroller.shorturl);

router.get("/:urlCode", urlcontroller.geturl);

router.all("/*", function (req, res) {
  return res.send({ status: false, message: "no route found" });
});

module.exports = router;
