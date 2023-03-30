import express from "express";
import {
    getBarangs, 
    getBarangById,
    createBarang,
    updateBarang,
    deleteBarang,
    getStockPerLocation
} from "../controllers/BarangController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/barang`, verifyToken2, getBarangs);
router.get(`${api}/barang/:id`, verifyToken2, adminOnly, getBarangById);
router.post(`${api}/barang`, verifyToken2, adminOnly, createBarang);
router.put(`${api}/barang/:id`, verifyToken2, adminOnly, updateBarang);
router.delete(`${api}/barang/:id`, verifyToken2, adminOnly, deleteBarang);
router.post(`${api}/stock`, verifyToken2, getStockPerLocation);

export default router;