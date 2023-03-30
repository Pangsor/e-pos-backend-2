import Barang from "../models/BarangModel.js";
import PembelianDetail from "../models/PembelianDetailModel.js";
import Pembelian from "../models/PembelianModel.js";
import Supplier from "../models/SupplierModel.js";
import {dateNow, dateNowFormat} from '../helper/ConvertDate.js';
import SaldoBarang from "../models/SaldoBarangModel.js";
import StockCard from "../models/StockCardModel.js";
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import sequelize from "../config/Database2.js";
import Joi from "joi";

export const getPembelians = async(req, res) =>{
    try {
        const response = await Pembelian.findAll({ 
            attributes: ['noTransaksi', 'tanggal', 'kodeSupplier'],
            include:[
                { 
                    model: PembelianDetail,
                    attributes: ['qty'],
                    include: [{model:Barang, attributes: ['namaBarang']}]
                }
            ],
            raw: true 
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
 
export const getPembelianById = async(req, res) =>{
    try {
        const response = await Pembelian.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Pembelian Not Found",
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
 
export const createPembelian = async(req, res) =>{
    try {
        // const result = await sequelize.transaction(async (t) => {
            const schema = Joi.object().keys({
                tanggal: Joi.string().required(),
                kodeSupplier: Joi.string().required(),
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

            const {tanggal, kodeSupplier} = req.body;
            // Validate Request
            if(!tanggal){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Purchase date is required",
                    data:[]
                });
            }
            if(!kodeSupplier){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Supplier code is required",
                    data:[]
                });
            }
            
            const checkSupplier = await Supplier.findOne({
                where:{
                    id: kodeSupplier    
                }
            })
            if (checkSupplier == null){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Supplier not found",
                    data:[]
                });
            }
            // Validate Request

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
            
            // counter
            let tglBeli = dateNow();
            let dateFormat = dateNowFormat("YYYYMMDD")
            let counter;
            const response = await Pembelian.findOne({
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

            let pembelian = await Pembelian.create({
                noTransaksi : counter,
                tanggal : tanggal,
                kodeSupplier: kodeSupplier,
                supplierId: kodeSupplier
            });
            
            let sumQty = 0;
            for(let i in req.body.barang){
                sumQty += parseInt(req.body.barang[i].qty);
                
                // save pembelian detail
                await PembelianDetail.create({
                    qty: req.body.barang[i].qty,
                    pembelianId : pembelian.id,
                    barangId : req.body.barang[i].barangId
                });
                
                // save card
                await StockCard.create({
                    pembelianId: pembelian.id,
                    tanggal: new Date(),
                    kategori: 'PEMBELIAN',
                    barangId: req.body.barang[i].barangId,
                    qty: req.body.barang[i].qty
                });
                // end save card

                // update saldo barang
                /*
                await SaldoBarang.update(
                    {
                        saldo: Sequelize.literal(`saldo + ${req.body.barang[i].qty}`)
                    },
                    {
                        where: {
                            kodeBarang: req.body.barang[i].kodeBarang
                        }
                    }
                );
                */
                // end update saldo barang

                // update saldo barang lokasi
                await SaldoBarangLokasi.update(
                    {
                        beliSupplier: Sequelize.literal(`beliSupplier + ${req.body.barang[i].qty}`),
                        stockAkhir: Sequelize.literal(`stockAkhir + ${req.body.barang[i].qty}`)
                    },
                    {
                        where: {
                            barangId: req.body.barang[i].barangId,
                            lokasiStock: 'PUSAT'
                        }
                    }
                );
                // end update saldo barang lokasi
            }
            
            // update totalQty
            await Pembelian.update(
                { totalQty: sumQty },
                { where: { id: pembelian.id } }
            );
            // end update totalQty

            return res.status(201).json({
                statusCode:"200",
                message:"Purchase Created",
                data:pembelian
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
 
