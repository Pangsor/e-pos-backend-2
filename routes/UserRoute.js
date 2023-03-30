import express from "express";
import {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    Login
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/users`, getUsers);
router.get(`${api}/users/:id`, getUserById);
router.post(`${api}/users`, createUser);
router.put(`${api}/users/:id`, updateUser);
router.delete(`${api}/users/:id`, deleteUser);
router.post(`${api}/login`, Login);
 
export default router;