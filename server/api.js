/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Comment = require("./models/comment")
const Fractal = require("./models/fractal")

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id }, function(err, user) {
    res.send(user);
  });
});

router.get("/posts", async (req, res) => {
  try {
    const fractals = await Fractal.find({});
    res.send(fractals);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});

router.get("/comment", async (req,res) => {
  try {
    const comments = await Comment.find({fractal_id: req.query.parent});
    res.send(comments)
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});

router.get("/comment", async (req, res) => {
  Comment.find({ fractal_id: req.query.fractal_id }).then((comments) => {
    res.send(comments); // You need to send the response back to the client
  }).catch((err) => {
    res.status(500).json({ error: "Failed to fetch comments" }); // Handle errors
  });
});


// router.get("/posts", async (req, res) => {
//   try {
//     const fractals = await Fractal.find({ is_public: true }); // Add the filter here
//     res.send(fractals);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
//   }
// });




// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
