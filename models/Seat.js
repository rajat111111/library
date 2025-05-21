const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type: Number,
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        libraryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Library',
            required: true
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        planType: {
            type: String,
            enum: ['monthly', 'yearly'],
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Seat', seatSchema);
