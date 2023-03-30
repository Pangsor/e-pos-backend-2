import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
 
const {DataTypes} = Sequelize;
 
const StockCard = db.define('stock_card',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    kodeBarang: DataTypes.STRING,
    tanggal: DataTypes.DATEONLY,
    kategori: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
},{
    freezeTableName:true
});
 
Barang.hasMany(StockCard);
StockCard.belongsTo(Barang);

export default StockCard;
 
(async()=>{
    await db.sync();
})();