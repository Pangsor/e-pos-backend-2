import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const Category = db.define('category',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    categoryName: DataTypes.STRING,
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
 
export default Category;
 
(async()=>{
    await db.sync();
})();