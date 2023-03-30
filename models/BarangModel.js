import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const Barang = db.define('barang',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    kodeBarang: {type: DataTypes.STRING},
    namaBarang: DataTypes.STRING,
    kategori: DataTypes.STRING,
    ukuran: DataTypes.STRING,
    warna: DataTypes.STRING,
    satuanBeli: DataTypes.STRING,
    satuanJual: DataTypes.STRING,
    isi: DataTypes.INTEGER,
    hargaBeli: DataTypes.BIGINT,
    hargaJual: DataTypes.BIGINT,
    stock: DataTypes.BIGINT,
    minimumStock: DataTypes.INTEGER,
    tanggalBeli: DataTypes.DATEONLY,
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
 
export default Barang;
 
(async()=>{
    await db.sync();
})();