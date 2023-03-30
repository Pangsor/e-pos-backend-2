import express from "express";
import {
    getCategories, 
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/CategoryController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 
 
router.get(`${api}/category`, verifyToken2, adminOnly, getCategories);
router.get(`${api}/category/:id`, verifyToken2, adminOnly, getCategoryById);
router.post(`${api}/category`, verifyToken2, adminOnly, createCategory);
router.put(`${api}/category/:id`, verifyToken2, adminOnly, updateCategory);
router.delete(`${api}/category/:id`, verifyToken2, adminOnly, deleteCategory);
 
export default router;