import Barang from "../models/BarangModel.js";
import {dateNow, dateNowFormat} from '../helper/ConvertDate.js';
import SaldoBarang from "../models/SaldoBarangModel.js";
import StockCard from "../models/StockCardModel.js";
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import { Sequelize, QueryTypes } from "sequelize";
import KirimCabang from "../models/KirimCabangModel.js";
import KirimCabangDetail from "../models/KirimCabangDetailModel.js";
import Branch from "../models/BranchModel.js";
import ReturPusat from "../models/ReturPusatModel.js";
import ReturPusatDetail from "../models/ReturPusatDetailModel.js";
import Joi from "joi";
import db from "../config/Database.js";

export const getReturPusats = async(req, res) =>{
    try {
        // const response = await ReturPusat.findAll({ 
        //     attributes: ['noTransaksi', 'tanggal', 'kodeCabang'],
        //     include:[
        //         { 
        //             model: ReturPusatDetail,
        //             attributes: ['qty'],
        //             include: [{model:Barang, attributes: ['namaBarang']}]
        //         }
        //     ],
        //     raw: true 
        // });
        const response = await db.query(`SELECT a.id,a.noTransaksi,a.tanggal,a.kodeCabang,a.totalQty
                                        ,b.branchName FROM retur_pusat a INNER JOIN branch b
                                        ON a.kodeCabang = b.id`,
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
 
export const getReturPusatById = async(req, res) =>{
    try {
        const response = await ReturPusat.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Retur pusat Not Found",
                data:[]
            });
        }
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
 
export const createReturPusat = async(req, res) =>{
    try {
        let namaBarang;
        // const result = await sequelize.transaction(async (t) => {
            const schema = Joi.object().keys({
                kodeCabang: Joi.string().required(),
                kirimCabangId: Joi.string().required(),
                barang: Joi.array().items(
                    Joi.object().keys({
                        barangId: Joi.string().required(),
                        qty: Joi.number().required()
                    })
                )
            }).required();
            if (schema.validate(req.body).error) {
                return res.status(400).json({
                    statusCode:"200",
                    message:schema.validate(req.body).error.message,
                    data:[]
                });
            }

            const {kodeCabang, kirimCabangId} = req.body;

            // Check Status Retur
            let checkStatus = await KirimCabang.findOne({ 
                where:{ id: kirimCabangId, statusRetur: "OPEN" } 
            })
            if(checkStatus == null){
                return res.status(400).json({
                    statusCode:"200",
                    message:`No Kirim Cabang -> ${kirimCabangId} not found`,
                    data:[]
                });
            }
            // End Check Status Retur
            
            // Check barang exist and stock
            for(let i in req.body.barang){
                let checkBarang = await Barang.findOne({ 
                    where:{ id: req.body.barang[i].barangId } 
                })
                if(checkBarang == null){
                    return res.status(400).json({
                        statusCode:"200",
                        message:`barangId -> ${req.body.barang[i].barangId} not found`,
                        data:[]
                    });
                }
                namaBarang = checkBarang.namaBarang;

                // check stock
                let checkStock = await KirimCabangDetail.findOne({ 
                    where:{ 
                        kirimCabangId: kirimCabangId,
                        barangId: req.body.barang[i].barangId
                    } 
                })
                if(checkStock == null){
                    return res.status(400).json({
                        statusCode:"200",
                        message:`${namaBarang} not found`,
                        data:[]
                    });
                }
                let remainingStock = checkStock.qty - checkStock.qtyJual; 
                if(remainingStock < req.body.barang[i].qty){
                    return res.status(400).json({
                        statusCode:"200",
                        message:`stock not enough -> ${namaBarang}`,
                        data:[]
                    });
                }
                // end check stock
            }
            // End check barang exist and stock

            const response2 = await Branch.findOne({
                where:{
                    id: kodeCabang
                }
            });
            if(!response2){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Branch not found",
                    data:[]
                });
            }
            // Validate Request
            
            // counter
            let tanggal = dateNow();
            let dateFormat = dateNowFormat("YYYYMMDD")
            let counter;
            const response = await ReturPusat.findOne({
                where:{
                    tanggal:tanggal
                },
                order: [
                    ["createdAt","DESC"]
                ]
            });
            // YYYYMMDD0001
            if (response == null){
                counter = dateFormat + Number(1).pad(4);
            }else{
                counter = dateFormat + Number(Number(String(response.noTransaksi).slice(9,12)) + 1).pad(4);
            }
            // counter

            let returPusat = await ReturPusat.create({
                noTransaksi : counter,
                tanggal : tanggal,
                kodeCabang: kodeCabang,
                branchId: kodeCabang
            });
            
           
            let sumQty = 0;
            for(let i in req.body.barang){
                sumQty += parseInt(req.body.barang[i].qty);

                // save retur pusat detail
                await ReturPusatDetail.create({
                    qty: req.body.barang[i].qty,
                    returPusatId : returPusat.id,
                    barangId : req.body.barang[i].barangId,
                    idReturPusat : returPusat.id,
                    idBarang : req.body.barang[i].barangId
                });
                
                // save card PUSAT
                await StockCard.create({
                    tanggal: new Date(),
                    kategori: 'RETUR PUSAT',
                    qty: req.body.barang[i].qty,
                    returPusatId: returPusat.id,
                    barangId: req.body.barang[i].barangId,
                });
                // end save card PUSAT

                // update saldo barang lokasi PUSAT
                await SaldoBarangLokasi.update(
                    {
                        terimaReturCabang: Sequelize.literal(`terimaReturCabang + ${req.body.barang[i].qty}`),
                        stockAkhir: Sequelize.literal(`stockAkhir + ${req.body.barang[i].qty}`)
                    },
                    {
                        where: {
                            barangId: req.body.barang[i].barangId,
                            lokasiStock: 'PUSAT'
                        }
                    }
                );
                // end update saldo barang lokasi PUSAT

                // upsert saldo barang lokasi CABANG
                const saldoCabang = await SaldoBarangLokasi.findOne({ 
                    where: { 
                        barangId: req.body.barang[i].barangId,
                        lokasiStock: kodeCabang
                    }
                });
                if(!saldoCabang){
                    await SaldoBarangLokasi.create({
                        barangId: req.body.barang[i].barangId,
                        lokasiStock: kodeCabang,
                        stockAwal: req.body.barang[i].qty,
                        returPusat: req.body.barang[i].qty,
                        stockAkhir: 0
                    })
                }else{
                    await SaldoBarangLokasi.update(
                        {
                            returPusat: Sequelize.literal(`returPusat + ${req.body.barang[i].qty}`),
                            stockAkhir: Sequelize.literal(`stockAkhir - ${req.body.barang[i].qty}`)
                        },
                        {
                            where: {
                                barangId: req.body.barang[i].barangId,
                                lokasiStock: kodeCabang
                            }
                        }
                    );
                }
                // end upsert saldo barang CABANG
            }
            
            // update totalQty
            await ReturPusat.update(
                { 
                    totalQty: sumQty
                },
                { where: { id: returPusat.id } }
            );
            // end update totalQty

            // update status retur
            await KirimCabang.update(
                { 
                    statusRetur: "CLOSE"
                },
                { where: { id: kirimCabangId } }
            );

            return res.status(201).json({
                statusCode:"200",
                message:"Retur branch Created",
                data:returPusat
            });
        // });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
