const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
// const User = require('./userModel');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: 0,
    subject: { type: String, required: true },
    chapters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Chapter",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookSchema.pre("save", async function (next) {
  const response = await fetch(
    "http://ec2-3-82-197-46.compute-1.amazonaws.com/user/TX-Dynamics/books/rate"
  );

  const data = await response.json();
  price = this.price;
  apiPrice = data.data.price;
  this.price = apiPrice;
  next();
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
