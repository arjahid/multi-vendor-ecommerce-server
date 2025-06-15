import express from 'express';
import { registerUser,authUser } from '../controllers/userControllers';
const router=express.Router();
router.post('/register', registerUser);
router.post('/login', authUser);