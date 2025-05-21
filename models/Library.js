const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Assuming Admin is also a user
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Library', librarySchema);
