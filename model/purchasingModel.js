const mongoose = require('mongoose');


const purchasingSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true, 'A booking must belong to a book.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'A book must have a price.'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})


const Purchasing = mongoose.model('Purchasing', purchasingSchema);
module.exports = Purchasing;