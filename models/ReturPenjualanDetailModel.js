import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import ReturPenjualan from "./ReturPenjualanModel.js";
import StockCard from "./StockCardModel.js";

const {DataTypes} = Sequelize;
 
const ReturPenjualanDetail = db.define('retur_penjualan_detail',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    qty: DataTypes.INTEGER,
    harga: DataTypes.BIGINT,
    diskonRp: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    jumlahRp: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    jumlahRpPusat: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    jumlahRpBranch: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
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

// association 
ReturPenjualan.hasMany(ReturPenjualanDetail)
ReturPenjualanDetail.belongsTo(ReturPenjualan)

// association barang
Barang.hasMany(ReturPenjualanDetail)
ReturPenjualanDetail.belongsTo(Barang)

// association stock card
ReturPenjualan.hasMany(StockCard)
StockCard.belongsTo(ReturPenjualan)

export default ReturPenjualanDetail;
 
(async()=>{
    await db.sync();
})();