import express from "express";
import {
    getBranchs, 
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
} from "../controllers/BranchController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/branch`, verifyToken2, getBranchs);
router.get(`${api}/branch/:id`, verifyToken2, adminOnly, getBranchById);
router.post(`${api}/branch`, verifyToken2, adminOnly, createBranch);
router.put(`${api}/branch/:id`, verifyToken2, adminOnly, updateBranch);
router.delete(`${api}/branch/:id`, verifyToken2, adminOnly, deleteBranch);
 
export default router;