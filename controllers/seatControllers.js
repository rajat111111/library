const Seat = require('../models/Seat');

// Create seat
exports.createSeat = async (req, res) => {
    try {
        const { seatNumber, libraryId } = req.body;

        const existing = await Seat.findOne({ seatNumber, libraryId });
        if (existing) {
            return res.status(400)
                .json(
                    {
                        status: "failure",
                        message: 'Seat already exists in this library'
                    });
        }

        const seat = new Seat({ seatNumber, libraryId });
        await seat.save();
        res.status(201).json({ status: "success", message: "seat created successfully", seat });
    } catch (err) {
        res.status(500).json({ status: "failure", message: 'Server Error', error: err.message });
    }
};

// Get all seats for a library
exports.getSeatsByLibrary = async (req, res) => {
    try {
        const { libraryId } = req.params;
        const seats = await Seat.find({ libraryId }).populate('userId', 'name email');
        res.json({ status: "success", message: "seats retrieved successfully", seats });
    } catch (err) {
        res.status(500).json({ status: "failure", message: 'Server Error' });
    }
};

// Assign a seat
exports.assignSeat = async (req, res) => {
    try {
        const { seatId } = req.params;
        const { userId, planType, startDate, endDate } = req.body;

        const seat = await Seat.findById(seatId);
        if (!seat) return res.status(404).json({ message: 'Seat not found' });

        seat.isBooked = true;
        seat.userId = userId;
        seat.planType = planType;
        seat.startDate = startDate;
        seat.endDate = endDate;

        await seat.save();
        res.json({ status: "success", message: 'Seat assigned successfully', seat });
    } catch (err) {
        res.status(500).json({ status: "failure", message: 'Server Error' });
    }
};

// Unassign (free) a seat
exports.freeSeat = async (req, res) => {
    try {
        const { seatId } = req.params;
        const seat = await Seat.findById(seatId);
        if (!seat) return res.status(404).json({ status: "failure", message: 'Seat not found' });

        seat.isBooked = false;
        seat.userId = null;
        seat.planType = null;
        seat.startDate = null;
        seat.endDate = null;

        await seat.save();
        res.json({ status: "success", message: 'Seat freed successfully', seat });
    } catch (err) {
        res.status(500).json({ status: "success", message: 'Server Error' });
    }
};

//find free seats of library
exports.getFreeSeatsByLibrary = async (req, res) => {
    try {
        const { libraryId } = req.params;

        // Find all seats for the library that are not booked
        const freeSeats = await Seat.find({ libraryId, isBooked: false });

        res.status(200).json({
            success: true,
            seats: freeSeats
        });
    } catch (err) {
        console.error('Error fetching free seats:', err);
        res.status(500).json({
            success: failure,
            message: 'Server Error'
        });
    }
};

//delete seat 
exports.deleteSeat = async (req, res) => {
    try {
        const { seatId } = req.params;

        const deletedSeat = await Seat.findByIdAndDelete(seatId);

        if (!deletedSeat) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        res.json({ message: 'Seat deleted successfully', seat: deletedSeat });
    } catch (error) {
        console.error('Delete Seat Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

