import express from "express";
import {
    getPembelians, 
    getPembelianById,
    createPembelian,
} from "../controllers/PembelianController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/pembelian`, verifyToken2, getPembelians);
router.get(`${api}/pembelian/:id`, verifyToken2, getPembelianById);
router.post(`${api}/pembelian`,verifyToken2, createPembelian);
// router.put(`${api}/pembelian/:id`,verifyToken2, updateSupplier);
// router.delete(`${api}/pembelian/:id`,verifyToken2, deleteSupplier);
 
export default router;