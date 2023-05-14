const mongoose = require("mongoose");
const validator = require("validator");
// const User = require('./userModel');

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
