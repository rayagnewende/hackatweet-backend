var express = require("express");
var router = express.Router();
require("../models/connection");
const Trend = require("../models/trends");
const { checkBody } = require("../modules/checkBody");

router.get("/", (req, res) => {
  Trend.find().then((data) => {
    res.json({ data });
  });
});

module.exports = router;
