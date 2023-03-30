import express from "express";
import {
    getReturPusats, 
    getReturPusatById,
    createReturPusat,
} from "../controllers/ReturPusatController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/returPusat`, verifyToken2, getReturPusats);
router.get(`${api}/returPusat/:id`, verifyToken2, getReturPusatById);
router.post(`${api}/returPusat`,verifyToken2, createReturPusat);
// router.put(`${api}/kirimBarang/:id`,verifyToken2, updateSupplier);
// router.delete(`${api}/kirimBarang/:id`,verifyToken2, deleteSupplier);
 
export default router;