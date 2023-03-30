import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import ReturPusat from "./ReturPusatModel.js";
import StockCard from "./StockCardModel.js";

const {DataTypes} = Sequelize;
 
const ReturPusatDetail = db.define('retur_pusat_detail',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    qty: DataTypes.INTEGER,
    idReturPusat: DataTypes.STRING,
    idBarang: DataTypes.STRING,
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
ReturPusat.hasMany(ReturPusatDetail)
ReturPusatDetail.belongsTo(ReturPusat)

Barang.hasMany(ReturPusatDetail)
ReturPusatDetail.belongsTo(Barang)

ReturPusat.hasMany(StockCard)
StockCard.belongsTo(ReturPusat)

export default ReturPusatDetail;
 
(async()=>{
    await db.sync();
})();