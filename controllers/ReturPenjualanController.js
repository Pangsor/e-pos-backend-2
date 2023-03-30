import Barang from "../models/BarangModel.js";
import {dateNowFormat} from '../helper/ConvertDate.js';
import StockCard from "../models/StockCardModel.js";
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import { Sequelize } from "sequelize";
import ReturPenjualan from "../models/ReturPenjualanModel.js";
import ReturPenjualanDetail from "../models/ReturPenjualanDetailModel.js";
import Branch from "../models/BranchModel.js";
import Joi from "joi";

export const getReturPenjualans = async(req, res) =>{
    try {
        const response = await ReturPenjualan.findAll({ 
            attributes: ['id','noTransaksi',[Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), "%d-%m-%Y"),"tanggal",],'namaCustomer','totalQty','totalDiskon','totalRp'],
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
 
export const getReturPenjualanById = async(req, res) =>{
    try {
        const response = await ReturPenjualan.findAll({
            attributes:['id','noTransaksi',[Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), "%d-%m-%Y"),"tanggal",],'namaCustomer','totalQty','totalDiskon','totalRp'],
            include:[
                { 
                    model: ReturPenjualanDetail,
                    attributes: ['qty','harga','diskonRp','jumlahRp'],
                    include: [
                        {
                            model:Barang,
                            attributes: ['namaBarang','kategori']
                        }
                    ],
                }
            ],
            where:{
                id: req.params.id,
            },
            raw:true
        });
        if(!response){
            return res.status(400).json({
                statusCode:"200",
                message:"Penjualan Not Found",
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
 
export const createReturPenjualan = async(req, res) =>{
    try {
        // const result = await sequelize.transaction(async (t) => {
            const schema = Joi.object().keys({
                tanggal: Joi.string().required(),
                namaCustomer: Joi.string().required(),
                lokasi: Joi.string().required(),
                barang: Joi.array().items(
                    Joi.object().keys({
                        barangId: Joi.string().required(),
                        qty: Joi.number().required(),
                        diskon: Joi.number().required(),
                        harga: Joi.number().required(),
                        jumlahRp: Joi.number().required(),
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

            const {tanggal, namaCustomer, lokasi} = req.body;
            // Validate Request
            if(!tanggal){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Sale date is required",
                    data:[]
                });
            }
            if(!namaCustomer){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Customer name is required",
                    data:[]
                });
            }
            if(!lokasi){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Location stock is required",
                    data:[]
                });
            }
            
            const resLokasi = await Branch.findOne({
                where:{
                    id: lokasi
                }
            });
            if(!resLokasi){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Location not found",
                    data:[]
                });
            }
            const branchName = resLokasi.branchName;
            // Validate Request
            
            // counter
            let dateFormat = dateNowFormat("YYYYMMDD")
            let counter;
            const response = await ReturPenjualan.findOne({
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
            console.log("SIMPAN HEAD")
            let penjualan = await ReturPenjualan.create({
                noTransaksi : counter,
                tanggal : tanggal,
                namaCustomer: namaCustomer,
                lokasi: lokasi
            });
            
            let rpPusat = 0;
            let rpBranch = 0;
            let sumQty = 0;
            let sumDiskon = 0;
            let sumJumlahRp = 0;
            let sumJumlahRpPusat = 0;
            let sumJumlahRpBranch = 0;
            for(let i in req.body.barang){
                rpPusat = parseInt(req.body.barang[i].jumlahRp) * (70/100);
                rpBranch = parseInt(req.body.barang[i].jumlahRp) * (30/100);

                sumQty += parseInt(req.body.barang[i].qty);
                sumDiskon += parseInt(req.body.barang[i].diskon);
                sumJumlahRp += parseInt(req.body.barang[i].jumlahRp);
                sumJumlahRpPusat += parseInt(rpPusat);
                sumJumlahRpBranch += parseInt(rpBranch);

                // save penjualan detail
                await ReturPenjualanDetail.create({
                    qty: req.body.barang[i].qty,
                    harga: req.body.barang[i].harga,
                    diskonRp: req.body.barang[i].diskon,
                    jumlahRp: req.body.barang[i].jumlahRp,
                    jumlahRpPusat: rpPusat,
                    jumlahRpBranch: rpBranch,
                    penjualanId : penjualan.id,
                    barangId : req.body.barang[i].barangId
                });
                console.log("SIMPAN DETAIL")
                // save card
                await StockCard.create({
                    tanggal: new Date(),
                    kategori: 'RETUR PENJUALAN',
                    qty: req.body.barang[i].qty,
                    penjualanId: penjualan.id,
                    barangId: req.body.barang[i].barangId,
                });
                // end save card
                console.log("SIMPAN STOCKCARD")
                // update saldo barang lokasi
                if(branchName.toUpperCase() == "PUSAT"){
                    await SaldoBarangLokasi.update(
                        {
                            returJual: Sequelize.literal(`returJual + ${req.body.barang[i].qty}`),
                            stockAkhir: Sequelize.literal(`stockAkhir + ${req.body.barang[i].qty}`)
                        },
                        {
                            where: {
                                barangId: req.body.barang[i].barangId,
                                lokasiStock: 'PUSAT'
                            }
                        }
                    );
                }else{
                    let saldoCabang = await SaldoBarangLokasi.findOne({
                        where:{ barangId: req.body.barang[i].barangId, lokasiStock: lokasi }
                    })
                    if(saldoCabang){
                        await SaldoBarangLokasi.update(
                            {
                                returJual: Sequelize.literal(`returJual + ${req.body.barang[i].qty}`),
                                stockAkhir: Sequelize.literal(`stockAkhir + ${req.body.barang[i].qty}`)
                            },
                            {
                                where: {
                                    barangId: req.body.barang[i].barangId,
                                    lokasiStock: lokasi
                                }
                            }
                        );
                    }else{
                        await SaldoBarangLokasi.create({
                            barangId: req.body.barang[i].barangId,
                            lokasiStock: lokasi,
                            stockAwal: req.body.barang[i].qty,
                            returJual: req.body.barang[i].qty,
                            stockAkhir : req.body.barang[i].qty
                        })
                    }
                }
                // end update saldo barang lokasi
            }
            console.log("SIMPAN STOCK LOKASI")
            // update totalQty
            await ReturPenjualan.update(
                { 
                    totalQty: sumQty,
                    totalDiskon: sumDiskon,
                    totalRp: sumJumlahRp,
                    totalRpPusat: sumJumlahRpPusat,
                    totalRpBranch: sumJumlahRpBranch
                },
                { where: { id: penjualan.id } }
            );
            // end update totalQty
            console.log("UPDATE HEAD")
            return res.status(201).json({
                statusCode:"200",
                message:"Retur sales created",
                data:penjualan
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
 
