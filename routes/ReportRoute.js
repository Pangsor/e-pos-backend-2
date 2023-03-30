import express from "express";
import {
    reportPembelian,
    reportPenjualan,
    reportKirimCabang,
    reportReturPusat,
    reportLabaRugi
} from "../controllers/ReportController.js";
import { verifyUser, adminOnly, verifyToken2 } from "../middleware/AuthUser.js";
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const api = process.env.API_URL; 

router.post(`${api}/report/pembelian`, verifyToken2, reportPembelian);
router.post(`${api}/report/penjualan`, verifyToken2, reportPenjualan);
router.post(`${api}/report/kirim-cabang`, verifyToken2, reportKirimCabang);
router.post(`${api}/report/retur-pusat`, verifyToken2, reportReturPusat);
router.post(`${api}/report/labarugi`, verifyToken2, reportLabaRugi);
export default router;