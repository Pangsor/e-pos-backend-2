import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import Penjualan from "./PenjualanModel.js";
import StockCard from "./StockCardModel.js";

const {DataTypes} = Sequelize;
 
const PenjualanDetail = db.define('penjualan_detail',{
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

// association purchase
Penjualan.hasMany(PenjualanDetail)
PenjualanDetail.belongsTo(Penjualan)

// association barang
Barang.hasMany(PenjualanDetail)
PenjualanDetail.belongsTo(Barang)

// association stock card
Penjualan.hasMany(StockCard)
StockCard.belongsTo(Penjualan)

export default PenjualanDetail;
 
(async()=>{
    await db.sync();
})();