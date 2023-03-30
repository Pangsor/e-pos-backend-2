import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const Supplier = db.define('supplier',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    supplierName: DataTypes.STRING,
    address: DataTypes.STRING,
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
 
export default Supplier;
 
(async()=>{
    await db.sync();
})();