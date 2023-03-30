import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import BranchRoute from "./routes/BranchRoute.js";
import SupplierRoute from "./routes/SupplierRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import BarangRoute from "./routes/BarangRoute.js";
import PembelianRoute from "./routes/PembelianRoute.js";
import PenjualanRoute from "./routes/PenjualanRoute.js";
import KirimBarangRoute from "./routes/KirimBarangRoute.js";
import ReturPusatRoute from "./routes/ReturPusatRoute.js";
import ReturPenjualanRoute from "./routes/ReturPenjualanRoute.js";
import ReportRoute from "./routes/ReportRoute.js";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(UserRoute);
app.use(BranchRoute);
app.use(SupplierRoute);
app.use(CategoryRoute);
app.use(BarangRoute);
app.use(PembelianRoute);
app.use(PenjualanRoute);
app.use(KirimBarangRoute);
app.use(ReturPusatRoute);
app.use(ReturPenjualanRoute);
app.use(ReportRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log(`Server up and running on port ${PORT}...`));