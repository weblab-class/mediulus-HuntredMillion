const mongoose = require("mongoose");

//define a comment schema for the database
const CommentSchema = new mongoose.Schema({
  creator_id: String,
  fractal_id: String,
  content: String,
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);

