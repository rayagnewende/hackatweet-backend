var express = require("express");
var router = express.Router();
require("../models/connection");
const Tweet = require("../models/tweets");
const { checkBody } = require("../modules/checkBody");
const Trend = require("../models/trends");
const { checkHashtag } = require("../modules/checkHashtag");
const User = require("../models/users");

// Get the latest tweets for a user
router.get("/latest", (req, res) => {
  Tweet.find()
    .sort({ date: -1 })
    .then((latestTweets) => {
      if (latestTweets.length > 0) {
        res.json({ result: true, tweets: latestTweets });
      } else {
        res.json({ result: false, message: "No tweets at the moment" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Post the new tweets linked to user and trends!
router.post("/add/:token", (req, res) => {
  const { message } = req.body;
  const hashtags = checkHashtag(message);

  const trendPromises = [];

  for (let i = 0; i < hashtags.length; i++) {
    const trendPromise = Trend.findOne({ hashtag: hashtags[i] }).then(
      (existingTrend) => {
        if (!existingTrend) {
          console.log(existingTrend);
          const newTrend = new Trend({
            hashtag: hashtags[i],
          });
          // Save the new Trend if it doesn't exist
          return newTrend.save();
        } else {
          return existingTrend;
        }
      }
    );
    trendPromises.push(trendPromise);
  }

  Promise.all(trendPromises).then((data) => {
    // console.log(data);
    User.findOne({ token: req.params.token })
      .then((user) => {
        if (user) {
          const trendsIds = data.map((e) => e._id);
          const newTweet = new Tweet({
            message,
            user: user._id,
            hashtags: trendsIds,
          });
          return newTweet.save();
        }
      })
      .then((savedTweet) => {
        // Respond with success
        res.json({ success: true, tweets: savedTweet });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
});

// Delete tweet
router.delete("/:tweetId", (req, res) => {
  Tweet.deleteOne({ _id: req.params.tweetId })
    .then((data) => {
      res.json({ result: true, message: "Tweet deleted succesfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Get tweets by trend
router.get("/trends/:trendId", (req, res) => {
  Tweet.find({ hashtags: req.params.trendId })
    .sort({ date: -1 })
    .then((data) => {
      if (data.length > 0) {
        res.json({ result: true, tweets: data });
      } else {
        res.json({ result: false, tweets: [] });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
