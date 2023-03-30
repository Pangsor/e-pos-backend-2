import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Supplier from "./SupplierModel.js";

const {DataTypes} = Sequelize;
 
const Pembelian = db.define('pembelian',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    noTransaksi: { type:DataTypes.STRING },
    tanggal: DataTypes.DATEONLY,
    kodeSupplier: DataTypes.STRING,
    totalQty: DataTypes.BIGINT,
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

Supplier.hasMany(Pembelian)
Pembelian.belongsTo(Supplier)

export default Pembelian;
 
(async()=>{
    await db.sync({alter:true});
})();