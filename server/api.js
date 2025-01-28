/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { uploadFile, downloadFile } = require("./utils/gridfs");
const multer = require("multer");

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
const user = require("./models/user");

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per chunk
  },
});

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

router.get("/description", async (req, res) => {
  try {
    const userId = req.query.user; // Extract user ID from query parameters
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const user = await User.findById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({ description: user.bio }); // Send the bio in JSON format
  } catch (err) {
    res.status(500).send("Failed to fetch user description: " + err.message);
  }
});

router.post("/changeBio", async (req, res) => {
  try {
    const userId = req.body.user; // Extract the user ID from the request body
    const newBio = req.body.bio; // Extract the new bio from the request body

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (typeof newBio !== "string") {
      return res.status(400).json({ error: "Invalid bio format. Bio must be a string." });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's bio
    user.bio = newBio;

    // Save the changes to the database
    await user.save();

    // Respond with the updated bio
    res.status(200).json({ description: user.bio });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: "Failed to update user bio: " + err.message });
  }
});

router.get("/allPosts", async (req, res) => {
  try {
    const fractals = await Fractal.find({ creator_id: req.query.userId });
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
  try {
    const user = await User.findById(req.query.user_id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send({ error: "An error occurred while fetching the user" });
  }
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

router.post("/follow", async (req, res) => {
  try {
    const user = await User.findById(req.body.currentUser);
    const followingUser = await User.findOne({ name: req.body.user });

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
    res.status(500).send({ message: "Server error", error });
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    const nowuser = await User.findById(req.body.currentUser);
    const unfollowingUser = await User.findOne({ name: req.body.user });
    if (nowuser && unfollowingUser) {
      const index = nowuser.following.indexOf(req.body.user);
      if (index !== -1) {
        nowuser.following.splice(index, 1);
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

router.post("/createFractal", async (req, res) => {
  try {
    // Read default thumbnail image
    const defaultThumbnailPath = path.join(
      __dirname,
      "public",
      "../../client/src/components/imgs/thumbnaildefault.png"
    );
    const defaultThumbnailBuffer = await fs.readFile(defaultThumbnailPath);

    // Upload default thumbnail to GridFS
    const thumbnailId = await uploadFile(
      defaultThumbnailBuffer,
      "default_thumbnail.png",
      "image/png"
    );

    const user = await User.findById(req.body.userId);

    // Create new fractal with default values
    const newFractal = new Fractal({
      creator_id: req.body.userId,
      creator_name: user.name,
      title: "Untitled Fractal",
      description: "",
      backgroundColor: "#FFFFFF",
      drawMode: "line",
      treeModuleParallels: [],
      is_public: false,
      likes: 0,
      lastUpdated: new Date(),
      thumbnail: {
        fileId: thumbnailId,
        contentType: "image/png",
      },
    });

    const savedFractal = await newFractal.save();
    await User.findByIdAndUpdate(req.body.userId, { $push: { fractals: savedFractal._id } });
    res.status(200).send(savedFractal);
  } catch (err) {
    console.error("Error creating fractal:", err);
    res.status(500).send({ error: "Could not create fractal" });
  }
});

router.post("/updateFractal", async (req, res) => {
  try {
    const { thumbnail, _id, creator_id, ...fractalData } = req.body;

    const fractal = await Fractal.findById(_id);
    if (!fractal || fractal.creator_id !== creator_id) {
      return res.status(403).send({ error: "Not authorized" });
    }

    // If there's a new thumbnail, upload it to GridFS
    if (thumbnail) {
      const thumbnailBuffer = Buffer.from(thumbnail.data.split(",")[1], "base64");
      const thumbnailId = await uploadFile(
        thumbnailBuffer,
        `thumbnail_${_id}.png`,
        thumbnail.contentType
      );

      fractal.thumbnail = {
        fileId: thumbnailId,
        contentType: thumbnail.contentType,
      };
    }

    // Update other fractal data
    Object.assign(fractal, {
      ...fractalData,
      lastUpdated: new Date(),
    });

    const updatedFractal = await fractal.save();
    res.status(200).send(updatedFractal);
  } catch (err) {
    console.error("Error updating fractal:", err);
    res.status(500).send({ error: "Could not update fractal" });
  }
});

router.get("/fractal", async (req, res) => {
  try {
    const fractal = await Fractal.findById(req.query._id);
    if (!fractal) {
      return res.status(404).send({ error: "Fractal not found" });
    }
    res.send(fractal);
  } catch (err) {
    console.error("Error fetching fractal:", err);
    res.status(500).send({ error: "Could not fetch fractal" });
  }
});

router.get("/findFollowing", async (req, res) => {
  try {
    const user = await User.findById(req.query.user);

    if (user) {
      const followingUsers = user.following;
      res.send(followingUsers);
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to find followers" });
  }
});

router.get("/findFollowers", async (req, res) => {
  try {
    const user = await User.findById(req.query.user);
    if (user) {
      const followerUsers = user.followers;
      res.send(followerUsers);
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to find followers" });
  }
});

// Add new endpoint to serve thumbnails
router.get("/fractal/:id/thumbnail", async (req, res) => {
  try {
    console.log("1. Thumbnail request received for fractal:", req.params.id);
    const fractal = await Fractal.findById(req.params.id);

    if (!fractal) {
      console.log("2. ERROR: Fractal not found");
      return res.status(404).send({ error: "Fractal not found" });
    }

    console.log("3. Found fractal:", {
      id: fractal._id,
      thumbnailInfo: fractal.thumbnail,
    });

    if (!fractal.thumbnail || !fractal.thumbnail.fileId) {
      console.log("4. ERROR: No thumbnail data in fractal document");
      return res.status(404).send({ error: "Thumbnail not found" });
    }

    console.log("5. Attempting to download file with ID:", fractal.thumbnail.fileId);
    const thumbnailBuffer = await downloadFile(fractal.thumbnail.fileId);

    res.set("Content-Type", fractal.thumbnail.contentType);
    res.send(thumbnailBuffer);
  } catch (err) {
    console.error("Error serving thumbnail:", err);
    res.status(500).send({ error: "Could not serve thumbnail" });
  }
});

// New endpoint for chunked thumbnail upload
router.post("/fractal/:id/thumbnail", upload.single("thumbnail"), async (req, res) => {
  try {
    const fractal = await Fractal.findById(req.params.id);
    if (!fractal) {
      return res.status(404).send({ error: "Fractal not found" });
    }

    const thumbnailId = await uploadFile(
      req.file.buffer,
      `thumbnail_${req.params.id}.png`,
      req.file.mimetype
    );

    fractal.thumbnail = {
      fileId: thumbnailId,
      contentType: req.file.mimetype,
    };
    await fractal.save();

    res.status(200).send({ success: true });
  } catch (err) {
    console.error("Error uploading thumbnail:", err);
    res.status(500).send({ error: "Could not upload thumbnail" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
