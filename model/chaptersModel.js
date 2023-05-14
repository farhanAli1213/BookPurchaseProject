const mongoose = require("mongoose");
const validator = require("validator");
// const User = require('./userModel');


const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chapterNo: { type: Number, required: true },
    pages: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Page',
        },
      ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


// Query middleware for populating data
chapterSchema.pre(/^find/, function (next) {
  this.populate({
    path: "pages",
  });
  next();
});

const Chapter = mongoose.model("Chapter", chapterSchema);
module.exports = Chapter;