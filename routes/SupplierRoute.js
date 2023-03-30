import express from "express";
import {
    getSuppliers, 
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "../controllers/SupplierController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/supplier`, verifyToken2, getSuppliers);
router.get(`${api}/supplier/:id`, verifyToken2, adminOnly, getSupplierById);
router.post(`${api}/supplier`,verifyToken2, adminOnly, createSupplier);
router.put(`${api}/supplier/:id`,verifyToken2, adminOnly, updateSupplier);
router.delete(`${api}/supplier/:id`,verifyToken2, adminOnly, deleteSupplier);
 
export default router;