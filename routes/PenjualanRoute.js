import express from "express";
import {
    getPenjualans, 
    getPenjualanById,
    createPenjualan,
    getPenjualanByIdPk
} from "../controllers/PenjualanController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/penjualan`, verifyToken2, getPenjualans);
router.get(`${api}/penjualan/:id`, verifyToken2, getPenjualanById);
router.post(`${api}/penjualan`,verifyToken2, createPenjualan);
router.post(`${api}/penjualan-test`, getPenjualanByIdPk);
// router.delete(`${api}/pembelian/:id`,verifyToken2, deleteSupplier);
 
export default router;