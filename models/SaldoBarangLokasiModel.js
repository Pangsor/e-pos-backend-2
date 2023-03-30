import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Barang from "./BarangModel.js";
import Branch from "./BranchModel.js";
 
const {DataTypes} = Sequelize;
 
const SaldoBarangLokasi = db.define('saldo_barang_lokasi',{
    id: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true
    },
    kodeBarang: DataTypes.STRING,
    lokasiStock: DataTypes.STRING,
    stockAwal: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    beliSupplier: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    returSupplier: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    jual: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    returJual: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    kirimCabang: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    terimaPusat: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    returPusat: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    terimaReturCabang: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    adjustStock: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    stockAkhir: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
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
 
Barang.hasMany(SaldoBarangLokasi);
SaldoBarangLokasi.belongsTo(Barang);

Branch.hasMany(SaldoBarangLokasi);
SaldoBarangLokasi.belongsTo(Branch);

export default SaldoBarangLokasi;
 
(async()=>{
    await db.sync();
})();