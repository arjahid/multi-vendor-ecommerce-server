import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js'

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body; // fixed typo
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name, email,
        password: hashedPassword,
        role,
    })
    if (user) {
        res.status(201).json({
            _id: user._id, // changed from id to _id
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })
    }
    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Rename authuser to authUser
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

export { registerUser, authUser }; // changed export name