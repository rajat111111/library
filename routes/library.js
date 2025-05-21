const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware")
const { createLibrary, getAllLibraries, getLibraryById, updateLibrary, deleteLibrary } = require('../controllers/libraryController')


router.post('/libraries', auth, createLibrary)
router.get('/libraries', auth, getAllLibraries)
router.get('/libraries/:id', auth, getLibraryById)
router.put('/libraries/:id', auth, updateLibrary)
router.delete('/libraries/:id', auth, deleteLibrary)


module.exports = router;