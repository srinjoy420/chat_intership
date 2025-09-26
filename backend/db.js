import mysql from "mysql2/promise";
import dotenv from "dotenv"
import fs from "fs";
dotenv.config()

export const db = await mysql.createConnection({
    host:  "localhost",
    // port: process.env.DB_PORT,
    user:  "root",
    password: process.env.sql_pass,
    database: "chatapp",
   
});

console.log("mysql connect succesfully"); 
const [rows] = await db.execute("SHOW DATABASES;");
console.log("Databases:", rows);

