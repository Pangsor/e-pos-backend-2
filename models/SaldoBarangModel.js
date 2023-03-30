import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
 
const {DataTypes} = Sequelize;
 
const SaldoBarang = db.define('saldo_barang',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    kodeBarang: DataTypes.STRING,
    saldo: DataTypes.BIGINT,
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
 
export default SaldoBarang;
 
(async()=>{
    await db.sync();
})();