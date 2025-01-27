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
const Comment = require("./models/comment");
const Fractal = require("./models/fractal");

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
router.get("/user", function (req, res) {
  User.findOne({ _id: req.query._id }, function (err, user) {
    res.send(user);
  });
});

router.get("/Publicposts", async (req, res) => {
  try {
    const fractals = await Fractal.find({ is_public: true });
    res.send(fractals);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});


router.get("/allPosts", async (req, res) => {
  try {
    const fractals = await Fractal.find({ creator_id: req.query.user });
    res.send(fractals);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});

router.get("/UserPosts", async (req, res) => {
  try {
    const fractals = await Fractal.find({ creator_id: req.query.user });
    res.send(fractals);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});

router.get("/comment", async (req, res) => {
  try {
    const comments = await Comment.find({ fractal_id: req.query.parent });
    res.send(comments);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch fractals: " + err.message });
  }
});

router.get("/comment", async (req, res) => {
  Comment.find({ fractal_id: req.query.fractal_id })
    .then((comments) => {
      res.send(comments); // You need to send the response back to the client
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch comments" }); // Handle errors
    });
});

router.get("/UserName", async (req, res) => {
  User.findById(req.query.user_id).then((user) => {
    res.send(user);
  });
});

router.get("/isLiked", async (req, res) => {
  const user = await User.findById(req.query.user);

  if (user) {
    if (user.likes.includes(req.query.fractal)) {
      res.send(true);
    } else {
      res.send(false);
    }
  }
});

router.get("/isFollowing", async (req, res) => {
  const user = await User.findById(req.query.currentUser);

  if (user) {
    if (user.following.includes(req.query.user)) {
      res.send(true);
    } else {
      res.send(false);
    }
  }
});

// Handle like action
router.post("/like", async (req, res) => {
  try {
    const fractal = await Fractal.findOne({ _id: req.body.parent });
    const user = await User.findById(req.body.user);

    if (fractal && user) {
      fractal.likes += 1; // Increment likes
      await fractal.save();

      user.likes.push(fractal._id);
      await user.save();

      res.status(200).send({ likes: fractal.likes }); // Send updated likes
    } else {
      res.status(404).send({ message: "Fractal not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

router.post("/unlike", async (req, res) => {
  try {
    const fractal = await Fractal.findOne({ _id: req.body.parent });
    const user = await User.findById(req.body.user);

    if (fractal && user) {
      fractal.likes -= 1; // Decrement likes
      await fractal.save();

      const index = user.likes.indexOf(fractal._id);
      if (index !== -1) {
        user.likes.splice(index, 1);
      }
      await user.save();

      res.status(200).send({ likes: fractal.likes }); // Send updated likes
    } else {
      res.status(404).send({ message: "Fractal not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

router.post('/follow', async (req, res) => {
  try {
    const user = await User.findById(req.body.currentUser);
    const followingUser = await User.findOne({name: req.body.user});
    
    if (user && followingUser) {
      user.following.push(req.body.user);
      followingUser.followers.push(user.name);

      await user.save();
      await followingUser.save();
      res.send(true);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.log('another error')
    res.status(500).send({ message: "Server error", error });
  }
});

router.post('/unfollow', async (req,res) => {
  try {
    const nowuser = await User.findById(req.body.currentUser);
    const unfollowingUser = await User.findOne({name: req.body.user});
    if (nowuser && unfollowingUser) {
      const index = nowuser.following.indexOf(req.body.user);
      if (index !== -1) {
        nowuser.following.splice(index,1);
      }
      await nowuser.save();
      res.send(false);

      const index2 = unfollowingUser.followers.indexOf(nowuser.name);
      if (index2 !== -1) {
        unfollowingUser.followers.splice(index2, 1);
      }
      await unfollowingUser.save();

    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const newComment = new Comment({
      creator_name: req.body.creator || "Anonymous", // Replace with logged-in user logic
      fractal_id: req.body.parent, // Fractal ID
      content: req.body.content, // Comment content
    });

    const savedComment = await newComment.save();
    res.status(200).send(savedComment); // Respond with the saved comment
  } catch (error) {
    res.status(500).send({ error: "Failed to add comment" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
