import Penjualan from "../models/PenjualanModel.js";
import Pembelian from "../models/PembelianModel.js";
import KirimCabang from "../models/KirimCabangModel.js";
import ReturPusat from "../models/ReturPusatModel.js";
import { Sequelize, Op, QueryTypes  } from "sequelize";
import Joi from "joi";
import Supplier from "../models/SupplierModel.js";
import PenjualanDetail from "../models/PenjualanDetailModel.js";
import Barang from "../models/BarangModel.js";
import Branch from "../models/BranchModel.js";
import ReturPusatDetail from "../models/ReturPusatDetailModel.js";
import KirimCabangDetail from "../models/KirimCabangDetailModel.js";
import db from "../config/Database.js";

export const reportPenjualan = async (req, res) =>{
    try {
        const schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const { startDate, endDate} = req.body;
        // const response = await Penjualan.findAll({
        //     attributes:['noTransaksi','tanggal','namaCustomer','totalQty','diskonPerTransaksi','totalRp','jumlahBayar'],
        //     include:[
        //         {
        //             model: PenjualanDetail,
        //             attributes:['qty'],
        //             include:[
        //                 {
        //                     model: Barang,
        //                     attributes:['namaBarang']
        //                 }
        //             ]
        //         }
        //     ],
        //     where:{
        //         tanggal: {
        //             [Op.between]: [startDate,endDate]
        //         }
        //     },
        // });

        const response = await db.query(`SELECT a.noTransaksi,a.tanggal,a.namaCustomer,a.totalQty,a.diskonPerTransaksi
                                        ,a.totalRp,a.jumlahBayar,c.namaBarang FROM penjualan a INNER JOIN penjualan_detail b
                                        ON a.id = b.penjualanId
                                        INNER JOIN barang c ON b.barangId = c.id
                                        WHERE tanggal BETWEEN '${startDate}' AND '${endDate}'`,
            { type: QueryTypes.SELECT }
        );
        
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const reportPembelian = async(req, res) =>{
    try {
        const schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const { startDate, endDate} = req.body;
        const response = await Pembelian.findAll({
            attributes:['noTransaksi','tanggal','totalQty'],
            include:[
                { 
                    model: Supplier,
                    attributes:[Sequelize.literal('supplier.supplierName')]
                }
            ],
            where:{
                tanggal: {
                    [Op.between]: [startDate,endDate]
                }
            },
            raw:true
        });
       
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const reportKirimCabang = async(req, res) =>{
    try {
        const schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const { startDate, endDate} = req.body;
        // const response = await KirimCabang.findAll({
        //     attributes:['id','noTransaksi','tanggal','kodeCabang','totalQty'],
        //     include:[
        //         {
        //             model: Branch,
        //             attributes:['branchName']
        //         },
        //         {
        //             model: KirimCabangDetail,
        //             attributes:['qty'],
        //             include:[
        //                 {
        //                     model: Barang,
        //                     attributes:['namaBarang']
        //                 }
        //             ]
        //         }
        //     ],
        //     where:{
        //         tanggal: {
        //             [Op.between]: [startDate,endDate]
        //         }
        //     }
        // });

        const response = await db.query(`SELECT a.id,a.noTransaksi,a.tanggal,a.kodeCabang,a.totalQty,
                                        c.branchName,d.namaBarang FROM kirim_cabang a INNER JOIN kirim_cabang_detail b
                                        ON a.id = b.kirimCabangId
                                        INNER JOIN branch c ON a.branchId = c.id
                                        INNER JOIN barang d ON b.barangId = d.id
                                        WHERE a.tanggal BETWEEN '${startDate}' AND '${endDate}'
                                        ORDER BY a.id`,
            { type: QueryTypes.SELECT }
        );
       
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const reportReturPusat = async(req, res) =>{
    try {
        const schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const { startDate, endDate} = req.body;
        // const response = await ReturPusat.findAll({
        //     attributes:['id','noTransaksi','tanggal','kodeCabang','totalQty'],
        //     include:[
        //         {
        //             model: Branch,
        //             attributes:['branchName'],
        //         },
        //         {
        //             model: ReturPusatDetail,
        //             attributes:['qty'],
        //             include:[
        //                 {
        //                     model: Barang,
        //                     attributes:['namaBarang']
        //                 }
        //             ]
        //         }
        //     ],
        //     where:{
        //         tanggal: {
        //             [Op.between]: [startDate,endDate]
        //         }
        //     }
        // });

        const response = await db.query(`SELECT a.id,a.noTransaksi,a.tanggal,a.kodeCabang,a.totalQty,
                                        c.branchName,d.namaBarang FROM retur_pusat a INNER JOIN retur_pusat_detail b
                                        ON a.id = b.returPusatId
                                        INNER JOIN branch c ON a.branchId = c.id
                                        INNER JOIN barang d ON b.barangId = d.id
                                        WHERE a.tanggal BETWEEN '${startDate}' AND '${endDate}'
                                        ORDER BY a.id`,
            { type: QueryTypes.SELECT }
        );
       
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const reportLabaRugi = async (req, res) =>{
    try {
        const schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required()
        }).required();
        if (schema.validate(req.body).error) {
            return res.status(400).json({
                statusCode:"200",
                message:schema.validate(req.body).error.message,
                data:[]
            });
        }
        const { startDate, endDate} = req.body
        const response = await db.query(`SELECT a.id,a.noTransaksi,a.tanggal,a.namaCustomer,a.diskonPerTransaksi
                                        FROM penjualan a INNER JOIN penjualan_detail b
                                        ON a.id = b.penjualanId
                                        WHERE a.tanggal BETWEEN '${startDate}' AND '${endDate}'
                                        GROUP BY a.id`,
            { type: QueryTypes.SELECT }
        );
        
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:response
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
