const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json());

const authRoutes = require('./routes/auth')
const libraryRoutes = require('./routes/library')
const seatRoutes = require('./routes/seat')


app.use('/api/auth', authRoutes);
app.use('/api', libraryRoutes);
app.use('/api', seatRoutes);





module.exports = app;







