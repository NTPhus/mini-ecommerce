import { DataSource } from "typeorm";
import 'dotenv/config'

export const AppDataSource = new DataSource({
    type: 'mysql',                             
    host: process.env.MYSQL_HOST,              
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USERNAME,     
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    entities:['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],

    synchronize: false
})