import Barang from "../models/BarangModel.js";
import {dateNow, dateNowFormat} from '../helper/ConvertDate.js';
import StockCard from "../models/StockCardModel.js";
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import { Sequelize, QueryTypes } from "sequelize";
import KirimCabang from "../models/KirimCabangModel.js";
import KirimCabangDetail from "../models/KirimCabangDetailModel.js";
import Branch from "../models/BranchModel.js";
import Joi from "joi";
import db from "../config/Database.js";

export const getKirimBarangs = async(req, res) =>{
    try {
        // const response = await KirimCabang.findAll({ 
        //     attributes: ['id','noTransaksi', [Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), "%d-%m-%Y"),"tanggal"], 'kodeCabang','totalQty'],
        // });
        const response = await db.query(`SELECT a.id,a.noTransaksi,a.tanggal,a.kodeCabang,a.totalQty
                                        ,b.branchName FROM kirim_cabang a INNER JOIN branch b
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
 
export const getKirimBarangById = async(req, res) =>{
    try {
        const checkData = await KirimCabang.findOne({
            where:{
                id: req.params.id,
            }
        });
        if(checkData == null){
            return res.status(400).json({
                statusCode:"200",
                message:"Kirim barang Not Found",
                data:[]
            });
        }

        const responseHeader = await KirimCabang.findAll({
            attributes:['id','noTransaksi',
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), "%d-%m-%Y"),"tanggal",],
                'kodeCabang','totalQty'],
            where:{
                id: req.params.id,
            }
        });

        // Location
        const branchId = responseHeader[0].kodeCabang;
        const responseBranch = await Branch.findOne({
            attributes:['branchName','address'],
            where:{
                id: branchId,
            }
        });

        const kirimCabangId = responseHeader[0].id;
        const responseDetails = await KirimCabangDetail.findAll({
            attributes:['qty'],
            include:[
                { 
                    model: Barang,
                    attributes:[Sequelize.literal('barang.namaBarang')]
                }
            ],
            where:{
                kirimCabangId: kirimCabangId,
            },
            raw:true
        });

        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:{
                id: responseHeader[0].id,
                noTransaksi: responseHeader[0].noTransaksi,
                totalQty: responseHeader[0].totalQty,
                namaCabang: responseBranch.branchName,
                address: responseBranch.address,
                barang:responseDetails
            }
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const createKirimBarang = async(req, res) =>{
    try {
        // const result = await sequelize.transaction(async (t) => {
            const schema = Joi.object().keys({
                tanggal: Joi.string().required(),
                kodeCabang: Joi.string().required(),
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

            const {tanggal, kodeCabang} = req.body;
            // Validate Request
            if(!tanggal){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Tanggal kirim  is required",
                    data:[]
                });
            }
            if(!kodeCabang){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Customer name is required",
                    data:[]
                });
            }

            // Check barang exist
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
            }
            // End check barang exist
          
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
            const branchName = response2.branchName
            const address = response2.address
            // Validate Request
            
            // counter
            let tglJual = dateNow();
            let dateFormat = dateNowFormat("YYYYMMDD")
            let counter;
            const response = await KirimCabang.findOne({
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

            let kirimCabang = await KirimCabang.create({
                noTransaksi : counter,
                tanggal : tanggal,
                kodeCabang: kodeCabang,
                branchId: kodeCabang
            });
            
           
            let sumQty = 0;
            for(let i in req.body.barang){
                sumQty += parseInt(req.body.barang[i].qty);

                // save kirim cabang detail
                await KirimCabangDetail.create({
                    qty: req.body.barang[i].qty,
                    kirimCabangId : kirimCabang.id,
                    barangId : req.body.barang[i].barangId,
                    idKirimCabang : kirimCabang.id,
                    idBarang : req.body.barang[i].barangId,
                });
                
                // save card PUSAT
                await StockCard.create({
                    tanggal: new Date(),
                    kategori: 'KIRIM BARANG',
                    qty: req.body.barang[i].qty,
                    kirimCabangId: kirimCabang.id,
                    barangId: req.body.barang[i].barangId,
                });
                // end save card PUSAT

                // update saldo barang lokasi PUSAT
                await SaldoBarangLokasi.update(
                    {
                        kirimCabang: Sequelize.literal(`kirimCabang + ${req.body.barang[i].qty}`),
                        stockAkhir: Sequelize.literal(`stockAkhir - ${req.body.barang[i].qty}`)
                    },
                    {
                        where: {
                            barangId: req.body.barang[i].barangId,
                            lokasiStock: 'PUSAT'
                        }
                    }
                );
                // end update saldo barang lokasi PUSAT

                // update saldo barang lokasi CABANG
                let saldoCabang = await SaldoBarangLokasi.findOne({
                    where:{ barangId: req.body.barang[i].barangId, lokasiStock: kodeCabang }
                })
                if(saldoCabang){
                    await SaldoBarangLokasi.update(
                        {
                            terimaPusat: Sequelize.literal(`terimaPusat + ${req.body.barang[i].qty}`),
                            stockAkhir: Sequelize.literal(`stockAkhir + ${req.body.barang[i].qty}`)
                        },
                        {
                            where: {
                                barangId: req.body.barang[i].barangId,
                                lokasiStock: kodeCabang
                            }
                        }
                    );
                }else{
                    await SaldoBarangLokasi.create({
                        barangId: req.body.barang[i].barangId,
                        lokasiStock: kodeCabang,
                        terimaPusat: req.body.barang[i].qty,
                        stockAkhir : req.body.barang[i].qty,
                        branchId: kodeCabang
                    })
                }
                // end update saldo barang CABANG
            }
            
            // update totalQty
            await KirimCabang.update(
                { 
                    totalQty: sumQty
                },
                { where: { id: kirimCabang.id } }
            );
            // end update totalQty
            
            // response
            const responseDetails = await KirimCabangDetail.findAll({
                attributes:['qty'],
                include:[
                    { 
                        model: Barang,
                        attributes:[Sequelize.literal('barang.namaBarang')]
                    }
                ],
                where:{
                    kirimCabangId: kirimCabang.id,
                },
                raw:true
            });

            return res.status(201).json({
                statusCode:"200",
                message:"Kirim barang Created",
                data:{
                    id: kirimCabang.id,
                    noTransaksi: kirimCabang.noTransaksi,
                    totalQty: sumQty,
                    namaCabang: branchName,
                    address: address,
                    barang:responseDetails
                }
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
 
export const getDetailByBranchAndNoTrx = async(req, res) =>{
    try {
        const { branchId, noTransaksi} = req.body;
        const response = await db.query(`SELECT a.id AS kirimCabangId,a.noTransaksi,a.tanggal,a.kodeCabang,a.totalQty,
                                        c.branchName,b.barangId,d.namaBarang,d.kodeBarang,b.qty FROM kirim_cabang a
                                        INNER JOIN kirim_cabang_detail b
                                        ON a.id = b.kirimCabangId
                                        INNER JOIN branch c ON a.branchId = c.id
                                        INNER JOIN barang d ON b.barangId = d.id
                                        WHERE a.kodeCabang = '${branchId}' AND  a.noTransaksi = '${noTransaksi}'`,
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
