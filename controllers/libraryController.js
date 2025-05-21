const Library = require('../models/Library');
const Seat = require('../models/Seat');

// Create a new library (Admin only)
exports.createLibrary = async (req, res) => {
    try {
        const { name, location, totalSeats } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ status: "failure", message: 'Only admins can create libraries' });
        }

        const library = new Library({
            name,
            location,
            totalSeats,
            adminId: req.user.userId,
        });

        await library.save();

        const seats = [];
        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seatNumber: i,
                libraryId: library._id
            });
        }
        await Seat.insertMany(seats);

        return res.status(201).json({ status: "success", message: 'Library with seats created', library });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "failure", message: 'Server error' });
    }
};

// Get all libraries (anyone)
// Get all libraries
exports.getAllLibraries = async (req, res) => {
    try {
        let libraries;

        // If admin, return only their libraries
        if (req.user.role === 'admin') {
            libraries = await Library.find({ adminId: req.user.userId }).populate('adminId', 'name email');
        } else {
            // For superadmin or user (if applicable), show all
            libraries = await Library.find().populate('adminId', 'name email');
        }

        res.status(200).json({ status: "success", message: "Retrieved all library", libraries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get a single library by ID
exports.getLibraryById = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id).populate('adminId', 'name email');
        if (!library) {
            return res.status(404).json({ message: 'Library not found' });
        }
        res.status(200).json({ library });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update library details (Admin only)
exports.updateLibrary = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id);

        if (!library) return res.status(404).json({ message: 'Library not found' });

        if (library.adminId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not allowed to update this library' });
        }

        const { name, location, totalSeats } = req.body;

        library.name = name || library.name;
        library.location = location || library.location;
        library.totalSeats = totalSeats || library.totalSeats;

        await library.save();

        res.status(200).json({ message: 'Library updated', library });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a library (Admin only)
exports.deleteLibrary = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id);

        if (!library) return res.status(404).json({ message: 'Library not found' });

        if (library.adminId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not allowed to delete this library' });
        }

        await library.deleteOne();

        res.status(200).json({ message: 'Library deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
