import Barang from "../models/BarangModel.js";
import {dateNow, dateNowFormat} from '../helper/ConvertDate.js';
import StockCard from "../models/StockCardModel.js";
import SaldoBarangLokasi from "../models/SaldoBarangLokasiModel.js";
import { Sequelize } from "sequelize";
import Penjualan from "../models/PenjualanModel.js";
import PenjualanDetail from "../models/PenjualanDetailModel.js";
import Branch from "../models/BranchModel.js";
import KirimCabang from "../models/KirimCabangModel.js";
import KirimCabangDetailModel from "../models/KirimCabangDetailModel.js";
import Joi from "joi";
import db from "../config/Database.js";
import KirimCabangDetail from "../models/KirimCabangDetailModel.js";

export const getPenjualans = async(req, res) =>{
    try {
        const response = await Penjualan.findAll({ 
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
 
export const getPenjualanById = async(req, res) =>{
    try {
        const checkData = await Penjualan.findOne({
            where:{
                id: req.params.id,
            }
        });
        if(checkData == null){
            return res.status(400).json({
                statusCode:"200",
                message:"Penjualan Not Found",
                data:[]
            });
        }

        const responseHeader = await Penjualan.findAll({
            attributes:['id','noTransaksi',
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("tanggal"), "%d-%m-%Y"),"tanggal",],
                'namaCustomer','totalQty','totalDiskon','totalRp',
                'diskonPerTransaksi','jumlahBayar','lokasi'],
            where:{
                id: req.params.id,
            }
        });

        // Location
        const branchId = responseHeader[0].lokasi;
        const responseBranch = await Branch.findOne({
            attributes:['branchName'],
            where:{
                id: branchId,
            }
        });

        const penjualanId = responseHeader[0].id;
        const responseDetails = await PenjualanDetail.findAll({
            attributes:['qty','harga','diskonRp','jumlahRp'],
            include:[
                { 
                    model: Barang,
                    attributes:[Sequelize.literal('barang.namaBarang')]
                }
            ],
            where:{
                penjualanId: penjualanId,
            },
            raw:true
        });
        
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data:{
                tanggal: responseHeader[0].tanggal,
                namaCustomer: responseHeader[0].namaCustomer,
                lokasi: responseBranch.branchName,
                noTransaksi: responseHeader[0].noTransaksi,
                diskon_faktur: responseHeader[0].diskonPerTransaksi,
                totalHarga: responseHeader[0].totalRp,
                jumlahBayar: responseHeader[0].jumlahBayar,
                barang:responseDetails
            },

        });
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}

export const getPenjualanByIdPk = async(req, res) =>{
    try {
        let kirimCabang = await KirimCabang.findAll({
            attributes:['id'],
            where:{ kodeCabang: req.body.lokasi, statusRetur: "OPEN" },
            order:[
                ["id","ASC"]
            ]
        })
        for(let i = 0; i < kirimCabang.length; i++) {
            console.log(kirimCabang[i].id);
        }
        return res.status(200).json({
            statusCode:"200",
            message:"OK",
            data: kirimCabang
        });
    
    } catch (error) {
        console.log(error)
    }
}
 
export const createPenjualan = async(req, res) =>{
    try {
        let namaBarang;
        //const result = await db.transaction(async (t) => {
            const schema = Joi.object().keys({
                tanggal: Joi.string().required(),
                namaCustomer: Joi.string().required(),
                lokasi: Joi.string().required(),
                diskon_faktur: Joi.number().required(),
                totalHarga: Joi.number().required(),
                jumlahBayar: Joi.number().required(),
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
            
            const {tanggal, namaCustomer, lokasi, diskon_faktur, totalHarga, jumlahBayar} = req.body;
            let kembaliRp;
            kembaliRp = (parseInt(jumlahBayar) + parseInt(diskon_faktur)) - parseInt(totalHarga);
            if (kembaliRp < 0){
                return res.status(400).json({
                    statusCode:"200",
                    message:"Jumlah bayar kurang",
                    data:[]
                });
            }
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
                let checkStock = await SaldoBarangLokasi.findOne({ 
                    where:{ 
                        barangId: req.body.barang[i].barangId,
                        branchId: lokasi
                    } 
                })
                if(checkStock == null){
                    return res.status(400).json({
                        statusCode:"200",
                        message:`barang -> ${namaBarang} not found`,
                        data:[]
                    });
                }
                if(checkStock.stockAkhir < req.body.barang[i].qty){
                    return res.status(400).json({
                        statusCode:"200",
                        message:`stock not enough -> ${namaBarang}`,
                        data:[]
                    });
                }
                
            }
            // End check barang exist
            
            // counter
            let tglJual = dateNow();
            let dateFormat = dateNowFormat("YYYYMMDD")
            let counter;
            const response = await Penjualan.findOne({
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

            let totalRpPusat = 0;
            let totalRpBranch = 0;
            if (parseInt(totalHarga) > 0){
                totalRpPusat = parseInt(totalHarga) * (70/100);
                totalRpBranch = parseInt(totalHarga) * (30/100);
            }
            
            let penjualan = await Penjualan.create({
                noTransaksi : counter,
                tanggal : tanggal,
                namaCustomer: namaCustomer,
                lokasi: lokasi,
                diskonPerTransaksi: diskon_faktur,
                totalRp: totalHarga,
                totalRpPusat: totalRpPusat,
                totalRpBranch: totalRpBranch,
                jumlahBayar: jumlahBayar,
                kembaliRp: kembaliRp
            });
            
            let rpPusat = 0;
            let rpBranch = 0;
            let sumQty = 0;
            let sumDiskon = 0;
            let sumJumlahRp = 0;
            let sumJumlahRpPusat = 0;
            let sumJumlahRpBranch = 0;
            for(let i in req.body.barang){
                let checkBarang = await Barang.findOne({ 
                    where:{ id: req.body.barang[i].barangId } 
                })
                if(checkBarang == null){
                    continue;
                }
                rpPusat = parseInt(req.body.barang[i].jumlahRp) * (70/100);
                rpBranch = parseInt(req.body.barang[i].jumlahRp) * (30/100);

                sumQty += parseInt(req.body.barang[i].qty);
                sumDiskon += parseInt(req.body.barang[i].diskon);
                sumJumlahRp += parseInt(req.body.barang[i].jumlahRp);
                sumJumlahRpPusat += parseInt(rpPusat);
                sumJumlahRpBranch += parseInt(rpBranch);

                // save penjualan detail
                await PenjualanDetail.create({
                    qty: req.body.barang[i].qty,
                    harga: req.body.barang[i].harga,
                    diskonRp: req.body.barang[i].diskon,
                    jumlahRp: req.body.barang[i].jumlahRp,
                    jumlahRpPusat: rpPusat,
                    jumlahRpBranch: rpBranch,
                    penjualanId : penjualan.id,
                    barangId : req.body.barang[i].barangId
                });
                
                // save card
                await StockCard.create({
                    tanggal: new Date(),
                    kategori: 'PENJUALAN',
                    qty: req.body.barang[i].qty,
                    penjualanId: penjualan.id,
                    barangId: req.body.barang[i].barangId,
                });
                // end save card

                // update saldo barang lokasi
                if(branchName.toUpperCase() == "PUSAT"){
                    await SaldoBarangLokasi.update(
                        {
                            jual: Sequelize.literal(`jual + ${req.body.barang[i].qty}`),
                            stockAkhir: Sequelize.literal(`stockAkhir - ${req.body.barang[i].qty}`)
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
                                jual: Sequelize.literal(`jual + ${req.body.barang[i].qty}`),
                                stockAkhir: Sequelize.literal(`stockAkhir - ${req.body.barang[i].qty}`)
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
                            jual: req.body.barang[i].qty,
                            stockAkhir : 0
                        })
                    }

                    // update kirim cabang
                    let qtyRemaining = req.body.barang[i].qty;
                    let qtyUpdate = 0;
                    let kirimCabang = await KirimCabang.findAll({
                        attributes:['id'],
                        where:{ kodeCabang: lokasi, statusRetur: "OPEN" },
                        order:[
                            ["id","ASC"]
                        ]
                    })
                    if(kirimCabang != null){
                        for(let i = 0; i < kirimCabang.length; i++) {
                            console.log(kirimCabang[i].id);
                            let kirimCabangDetail = await KirimCabangDetail.findOne({
                                where:{ 
                                    kirimCabangId: kirimCabang[i].id,
                                    barangId: req.body.barang[i].barangId
                                }
                            })
                            if(kirimCabangDetail != null){
                                if(kirimCabangDetail.qty <= qtyRemaining){
                                    qtyRemaining -= kirimCabangDetail.qty;
                                    qtyUpdate = kirimCabangDetail.qty;
                                }else{
                                    qtyRemaining = 0;
                                }
                                
                                // update qty
                                await KirimCabangDetail.update(
                                    {
                                        qtyJual: Sequelize.literal(`qtyJual + ${qtyUpdate}`)
                                    },
                                    {
                                        where: {
                                            kirimCabangId: kirimCabang[i].id,
                                            barangId: req.body.barang[i].barangId
                                        }
                                    }
                                );
                                //
                            }
                            if(qtyRemaining <= 0){
                                break;
                            }
                        }
                    }

                    // Cara 2
                    
                    
                    // end update kirim cabang
                }
                // end update saldo barang lokasi
            }
            
            // update totalQty
            await Penjualan.update(
                { 
                    totalQty: sumQty,
                    totalDiskon: sumDiskon
                },
                { where: { id: penjualan.id } }
            );
            // end update totalQty
            
            penjualan.totalQty = sumQty;

            // response
            const responseDetails = await PenjualanDetail.findAll({
                attributes:['qty','harga','diskonRp','jumlahRp'],
                include:[
                    { 
                        model: Barang,
                        attributes:[Sequelize.literal('barang.namaBarang')]
                    }
                ],
                where:{
                    penjualanId: penjualan.id,
                },
                raw:true
            });

            return res.status(201).json({
                statusCode:"200",
                message:"Sales Created",
                data:{
                    id: penjualan.id,
                    tanggal: penjualan.tanggal,
                    namaCustomer: penjualan.namaCustomer,
                    lokasi: branchName,
                    noTransaksi: penjualan.noTransaksi,
                    diskon_faktur: penjualan.diskonPerTransaksi,
                    totalHarga: penjualan.totalRp,
                    jumlahBayar: penjualan.jumlahBayar,
                    barang:responseDetails
                }
            });
        //});
    } catch (error) {
        return res.status(500).json({
            statusCode:"200",
            message:error.message,
            data:[]
        });
    }
}
 
