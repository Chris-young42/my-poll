const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Poll = require('../models/Poll');
const bycrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
    const { fullName, username, email, password, profileImageUrl } = req.body;

    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }

    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, and dashes." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username not available" });
        }

        const user = await User.create({ fullName, username, email, password, profileImageUrl });
        res.status(201).json({ id: user._id, user, token: generateToken(user._id) });
    } catch (error) {

        res.status(500).json({ message: "Error user registering", error: error.message });
    }
}


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;  // Use email instead of username for login
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }
    try {
        const user = await User.findOne({ email });  // Find user by email
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const totalPollsCreated = await Poll.countDocuments({ creator: user._id })
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id
        })
        const totalPollsBookmarked = user.bookmarkedPolls.length

        res.status(200).json({
            id: user._id,
            user: {
                ...user.toObject(),
                totalPollsCreated,
                totalPollsVotes,
                totalPollsBookmarked
            }
            , token: generateToken(user._id)
        });  

    } catch (error) {
        res.status(500).json({ message: "Error user logging in", error: error.message });
    }
}
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");  // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalPollsCreated = await Poll.countDocuments({ creator: user._id })
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id
        })
        const totalPollsBookmarked = user.bookmarkedPolls.length
        const userInfo = {
            ...user.toObject(),
            totalPollsCreated,
            totalPollsVotes,
            totalPollsBookmarked
        }
        res.status(200).json(userInfo);  // Send user information without the password field
    } catch (error) {
        res.status(500).json({ message: "Error fetching user information", error: error.message });
    }
}