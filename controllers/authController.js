const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();



exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res
                .status(400)
                .json({
                    status: "failure",
                    message: "User already exists"
                });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashed, role });
        await user.save();

        res.status(201)
            .json({
                status: "success",
                message: 'User registered successfully'
            });
    } catch (error) {
        res.status(500)
            .json({ status: "failure", message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({
            status: "failure", message: 'Invalid credentials'
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            statusCode: 200,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            status: "success",
            message: "User Logged In Successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: "Server Error"
        });
    }
} 
