import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import Pembelian from "./PembelianModel.js";
import Penjualan from "./PenjualanModel.js";
import StockCard from "./StockCardModel.js";

const {DataTypes} = Sequelize;
 
const PembelianDetail = db.define('pembelian_detail',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    qty: DataTypes.INTEGER,
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
Pembelian.hasMany(PembelianDetail)
PembelianDetail.belongsTo(Pembelian)

// association barang
Barang.hasMany(PembelianDetail)
PembelianDetail.belongsTo(Barang)

// association stock card
Pembelian.hasMany(StockCard)
StockCard.belongsTo(Pembelian)

export default PembelianDetail;
 
(async()=>{
    await db.sync();
})();