import express from "express";
import {
    getKirimBarangs, 
    getKirimBarangById,
    createKirimBarang,
    getDetailByBranchAndNoTrx
} from "../controllers/KirimCabangController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/kirimCabang`, verifyToken2, getKirimBarangs);
router.get(`${api}/kirimCabang/:id`, verifyToken2, getKirimBarangById);
router.post(`${api}/kirimCabang`,verifyToken2, createKirimBarang);
router.post(`${api}/kirimCabang/detail`,verifyToken2, getDetailByBranchAndNoTrx);
// router.delete(`${api}/kirimBarang/:id`,verifyToken2, deleteSupplier);
 
export default router;