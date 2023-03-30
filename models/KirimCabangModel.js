import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Branch from "./BranchModel.js";
 
const {DataTypes} = Sequelize;
 
const KirimCabang = db.define('kirim_cabang',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    noTransaksi: { type:DataTypes.STRING },
    tanggal: DataTypes.DATEONLY,
    kodeCabang: DataTypes.STRING,
    totalQty: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    statusRetur: {type: DataTypes.STRING,defaultValue:"OPEN" } ,
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

Branch.hasMany(KirimCabang);
KirimCabang.belongsTo(Branch)
export default KirimCabang;
 
(async()=>{
    await db.sync();
})();