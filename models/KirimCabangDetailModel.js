import {INTEGER, Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import KirimCabang from "./KirimCabangModel.js";
import StockCard from "./StockCardModel.js";

const {DataTypes} = Sequelize;
 
const KirimCabangDetail = db.define('kirim_cabang_detail',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    qty: DataTypes.INTEGER,
    qtyJual: { type: DataTypes.INTEGER, defaultValue:0 },
    idKirimCabang:DataTypes.STRING,
    idBarang:DataTypes.STRING,
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
KirimCabang.hasMany(KirimCabangDetail)
KirimCabangDetail.belongsTo(KirimCabang)

// association barang
Barang.hasMany(KirimCabangDetail)
KirimCabangDetail.belongsTo(Barang)

// association stock card
KirimCabang.hasMany(StockCard)
StockCard.belongsTo(KirimCabang)

export default KirimCabangDetail;
 
(async()=>{
    await db.sync();
})();