const mongoose = require("mongoose");

const TreeModuleSchema = new mongoose.Schema({
  id: Number,
  name: String,
  numLines: Number,
  angle: Number,
  decay: Number,
  widthDecay: Number,
  color: String,
});

const TreeModuleParallelsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  numIters: Number,
  initWidth: Number,
  treeModules: [TreeModuleSchema],
});

//define a comment schema for the database
const FractalSchema = new mongoose.Schema({
  creator_name: String,
  creator_id: String,
  thumbnail: {
    fileId: { type: mongoose.Schema.Types.ObjectId }, // Reference to GridFS file
    contentType: String,
  },
  is_public: Boolean,
  likes: Number,
  description: String,
  title: String,
  treeModuleParallels: [TreeModuleParallelsSchema],
  backgroundColor: String,
  drawMode: { type: String, enum: ["line", "point"], default: "line" },
  lastUpdated: Date,
});

// compile model from schema
module.exports = mongoose.model("fractal", FractalSchema);
