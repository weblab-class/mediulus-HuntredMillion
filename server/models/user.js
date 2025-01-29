const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  profile_picture: {
    fileId: { type: mongoose.Schema.Types.ObjectId }, // Reference to GridFS file
    contentType: String,
  },
  bio: String,
  followers: Array,
  following: Array,
  fractals: Array,
  likes: Array,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
