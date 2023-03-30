import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Branch from "./BranchModel.js";
 
const {DataTypes} = Sequelize;
 
const ReturPusat = db.define('retur_pusat',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    noTransaksi: { type:DataTypes.STRING },
    tanggal: DataTypes.DATEONLY,
    kodeCabang: DataTypes.STRING,
    totalQty: {
        type: DataTypes.INTEGER,
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


Branch.hasMany(ReturPusat)
ReturPusat.belongsTo(Branch)
export default ReturPusat;
 
(async()=>{
    await db.sync();
})();