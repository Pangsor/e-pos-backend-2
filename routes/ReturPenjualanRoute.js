import express from "express";
import {
    getReturPenjualans, 
    getReturPenjualanById,
    createReturPenjualan,
} from "../controllers/ReturPenjualanController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/returPenjualan`, verifyToken2, getReturPenjualans);
router.get(`${api}/returPenjualan/:id`, verifyToken2, getReturPenjualanById);
router.post(`${api}/returPenjualan`,verifyToken2, createReturPenjualan);
 
export default router;