import Sequelize from "sequelize";
const conn = {};
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DB,process.env.MYSQL_USER,process.env.MYSQL_PASS,{
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    timezone: '+07:00' //for writing to database
});

conn.sequelize = sequelize;
conn.Sequelize = Sequelize;

export default conn;
