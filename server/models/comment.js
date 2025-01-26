const mongoose = require("mongoose");

//define a comment schema for the database
const CommentSchema = new mongoose.Schema({
  fractal_id: String,
  content: String,
  creator_name:String,
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);

