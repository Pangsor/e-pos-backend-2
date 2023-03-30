import {Sequelize} from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.MYSQL_DB,process.env.MYSQL_USER,process.env.MYSQL_PASS,{
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    timezone: '+07:00' //for writing to database
});

export default db;