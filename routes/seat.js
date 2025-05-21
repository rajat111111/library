const express = require('express');
const router = express.Router();
const {
    createSeat,
    getSeatsByLibrary,
    assignSeat,
    freeSeat,
    getFreeSeatsByLibrary,
    deleteSeat
} = require('../controllers/seatControllers');
const auth = require('../middlewares/authMiddleware');

// Routes
router.post('/seats', auth, createSeat);
router.get('/seats/:libraryId', auth, getSeatsByLibrary);
router.put('/seats/assign/:seatId', auth, assignSeat);
router.put('/seats/free/:seatId', auth, freeSeat);
router.get('/seats/freeSeats/:libraryId', auth, getFreeSeatsByLibrary);
router.delete('/seats/:id', auth, deleteSeat);

module.exports = router;
