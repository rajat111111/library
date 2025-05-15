const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();




app.get('/', (req, res) => {
    res.json("backend is running")
})

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})