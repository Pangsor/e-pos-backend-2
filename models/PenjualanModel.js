import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const Penjualan = db.define('penjualan',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    noTransaksi: { type:DataTypes.STRING },
    tanggal: DataTypes.DATEONLY,
    namaCustomer: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    totalQty: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    totalDiskon: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    totalRp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalRpPusat: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    totalRpBranch: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    diskonPerTransaksi: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    jumlahBayar: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    kembaliRp: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    createdBy: DataTypes.STRING,
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
    },
},{
    freezeTableName:true
});

export default Penjualan;
 
(async()=>{
    await db.sync();
})();