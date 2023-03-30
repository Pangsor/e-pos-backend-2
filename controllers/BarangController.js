import Barang from "../models/BarangModel.js";
import {dateNow, dateNowFormat} from '../helper/ConvertDate.js';
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import StockCard from "../models/StockCardModel.js";
import SaldoBarang from "../models/SaldoBarangModel.js";
import { Sequelize, Op } from "sequelize";
import Joi from "joi";
import Branch from "../models/BranchModel.js";

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

export const getBarangs = async(req, res,next) =>{
    try {
        const response = await Barang.findAll();
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
 
export const getBarangById = async(req, res) =>{
    try {
        const response = await Barang.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Goods Not Found",
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
 
export const createBarang = async(req, res) =>{
    try {
        let branchId;
        const {namaBarang, kategori, ukuran, warna, satuanBeli, satuanJual, isi, hargaBeli, hargaJual, stock, minimumStock} = req.body;
        // Validate Request
        if(!namaBarang){
            return res.status(400).json({
                statusCode:"200",
                message:"Goods name is required",
                data:[]
            });
        }
        if(!kategori){
            return res.status(400).json({
                statusCode:"200",
                message:"Category is required",
                data:[]
            });
        }
        if(!ukuran){
            return res.status(400).json({
                statusCode:"200",
                message:"Size is required",
                data:[]
            });
        }
        if(!warna){
            return res.status(400).json({
                statusCode:"200",
                message:"Color is required",
                data:[]
            });
        }
        if(!satuanBeli){
            return res.status(400).json({
                statusCode:"200",
                message:"Buying unit is required",
                data:[]
            });
        }
        if(!satuanJual){
            return res.status(400).json({
                statusCode:"200",
                message:"Selling unit is required",
                data:[]
            });
        }
        if(!isi){
            return res.status(400).json({
                statusCode:"200",
                message:"Content is required",
                data:[]
            });
        }
        if(!hargaBeli){
            return res.status(400).json({
                statusCode:"200",
                message:"Purchase price is required",
                data:[]
            });
        }
        if(!hargaJual){
            return res.status(400).json({
                statusCode:"200",
                message:"Sales price is required",
                data:[]
            });
        }
        if(!stock){
            return res.status(400).json({
                statusCode:"200",
                message:"Stock is required",
                data:[]
            });
        }
        if(!minimumStock){
            return res.status(400).json({
                statusCode:"200",
                message:"Minimum stock is required",
                data:[]
            });
        }

        const checkLokasi = await Branch.findOne({
            where:{
                branchName : 'PUSAT'
            }
        })
        if(!checkLokasi){
            return res.status(400).json({
                statusCode:"200",
                message:"Location PUSAT not found",
                data:[]
            });
        }
        branchId = checkLokasi.id;
        // Validate Request
        
        // counter kode barang
        let tglBeli = dateNow();
        let dateFormat = dateNowFormat("YYYYMMDD")
        let counter;
        const response = await Barang.findOne({
            where:{
                tanggalBeli:tglBeli
            },
            order: [
                ["createdAt","DESC"]
            ]
        });
        // YYYYMMDD0001
        if (response == null){
            counter = dateFormat + Number(1).pad(4);
        }else{
            counter = dateFormat + Number(Number(String(response.kodeBarang).slice(9,12)) + 1).pad(4);
        }
        let barang = await Barang.create({
            kodeBarang: counter,
            namaBarang: namaBarang,
            kategori: kategori,
            ukuran: ukuran,
            warna: warna,
            satuanBeli: satuanBeli,
            satuanJual: satuanJual,
            isi: isi,
            hargaBeli: hargaBeli,
            hargaJual: hargaJual,
            stock: stock,
            minimumStock: minimumStock,
            tanggalBeli: new Date(),
        });

        // save saldo barang lokasi
        await SaldoBarangLokasi.create({
            kodeBarang: counter,
            lokasiStock: 'PUSAT',
            stockAwal: stock,
            stockAkhir: stock,
            barangId: barang.id,
            branchId: branchId
        });
        
        // save stock card
        await StockCard.create({
            kodeBarang: counter,
            tanggal: new Date(),
            kategori: 'SALDO AWAL',
            qty: stock,
            barangId : barang.id
        });
        
        await SaldoBarang.create({
            kodeBarang: counter,
            saldo: stock
        });

        return res.status(201).json({
            statusCode:"200",
            message:"Goods Created",
            data:barang
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const updateBarang = async(req, res) =>{
    try {
        const {namaBarang, kategori, ukuran, warna, satuanBeli, satuanJual, isi, hargaBeli, hargaJual, stock, minimumStock} = req.body;
        // Validate Request
        if(!namaBarang){
            return res.status(400).json({
                statusCode:"200",
                message:"Goods name is required",
                data:[]
            });
        }
        if(!kategori){
            return res.status(400).json({
                statusCode:"200",
                message:"Category is required",
                data:[]
            });
        }
        if(!ukuran){
            return res.status(400).json({
                statusCode:"200",
                message:"Size is required",
                data:[]
            });
        }
        if(!warna){
            return res.status(400).json({
                statusCode:"200",
                message:"Color is required",
                data:[]
            });
        }
        if(!satuanBeli){
            return res.status(400).json({
                statusCode:"200",
                message:"Buying unit is required",
                data:[]
            });
        }
        if(!satuanJual){
            return res.status(400).json({
                statusCode:"200",
                message:"Selling unit is required",
                data:[]
            });
        }
        if(!isi){
            return res.status(400).json({
                statusCode:"200",
                message:"Content is required",
                data:[]
            });
        }
        if(!hargaBeli){
            return res.status(400).json({
                statusCode:"200",
                message:"Purchase price is required",
                data:[]
            });
        }
        if(!hargaJual){
            return res.status(400).json({
                statusCode:"200",
                message:"Sales price is required",
                data:[]
            });
        }
        if(!stock){
            return res.status(400).json({
                statusCode:"200",
                message:"Stock is required",
                data:[]
            });
        }
        if(!minimumStock){
            return res.status(400).json({
                statusCode:"200",
                message:"Minimum stock is required",
                data:[]
            });
        }
        // Validate Request

        const response = await Barang.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Goods not found",
                data:[]
            });
        }
        
        let barang = await Barang.update({
            namaBarang: namaBarang,
            kategori: kategori,
            ukuran: ukuran,
            warna: warna,
            satuanBeli: satuanBeli,
            satuanJual: satuanJual,
            isi: isi,
            hargaBeli: hargaBeli,
            hargaJual: hargaJual,
            stock: stock,
            minimumStock: minimumStock
        },{
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Goods Updated",
            data:[]
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
export const deleteBarang = async(req, res) =>{
    try {
        const response = await Barang.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!response)
        return res.status(400).json({
            statusCode:"200",
            message:"Goods not found",
            data:[]
        });
        let branch = await Barang.destroy({
            where:{
                id: req.params.id
            }
        });
        return res.status(200).json({
            statusCode:"200",
            message:"Goods Deleted",
            data:[]
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const getStockPerLocation = async(req, res) =>{
    try {
        // const schema = Joi.object().keys({
        //     lokasi: Joi.string().required()
        // }).required();
        // if (schema.validate(req.body).error) {
        //     return res.status(400).json({
        //         statusCode:"200",
        //         message:schema.validate(req.body).error.message,
        //         data:[]
        //     });
        // }
        let newLokasi = "";
        const lokasi = req.body.lokasi;
        if(lokasi){
            const responseBranch = await Branch.findOne({
                where: {
                    id: lokasi
                }
            })
            if(!responseBranch){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Location not found",
                    data:[]
                });
            }
            
            if (responseBranch.branchName.toUpperCase() == "PUSAT"){
                newLokasi = "PUSAT";
            }else{
                newLokasi = lokasi;
            }
        }
        
        if(newLokasi){
            const response = await SaldoBarangLokasi.findAll({
                attributes:['stockAkhir'],
                include:[
                    { 
                        model: Barang,
                        attributes: [Sequelize.literal('barang.kodeBarang'),Sequelize.literal('barang.namaBarang'),Sequelize.literal('barang.kategori')],
                    },
                    {
                        model: Branch,
                        attributes: [Sequelize.literal('branch.branchName')]
                    }
                ],
                where:{
                    lokasiStock: newLokasi,
                    stockAkhir: {
                        [Op.gt]: 0
                    }
                },
                raw:true
            });
            return res.status(200).json({
                statusCode:"200",
                message:"OK",
                data:response
            });
        }else{
            const response = await SaldoBarangLokasi.findAll({
                attributes:['stockAkhir'],
                include:[
                    { 
                        model: Barang,
                        attributes: [Sequelize.literal('barang.kodeBarang'),Sequelize.literal('barang.namaBarang'),Sequelize.literal('barang.kategori')],
                    },
                    {
                        model: Branch,
                        attributes: [Sequelize.literal('branch.branchName')]
                    }
                ],
                where:{
                    stockAkhir: {
                        [Op.gt]: 0
                    }
                },
                raw:true
            });
            return res.status(200).json({
                statusCode:"200",
                message:"OK",
                data:response
            });
        }
        
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
