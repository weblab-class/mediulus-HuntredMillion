const mongoose = require("mongoose");

//define a comment schema for the database
const FractalSchema = new mongoose.Schema({
  creator_id: String,
  img_url: String,
  is_public: Boolean,
  likes: Number,
  description: String,
});

// compile model from schema
module.exports = mongoose.model("fractal", FractalSchema);

