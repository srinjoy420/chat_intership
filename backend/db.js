import mysql from "mysql2/promise";
import dotenv from "dotenv"
import fs from "fs";
dotenv.config()

export const db = await mysql.createConnection({
    host: process.env.HOSt || "localhost",
    user: process.env.USER || "root",
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.DB_NAME||"chatapp",
    ssl: {
    ca: fs.readFileSync(process.env.DB_CA)
  }
});

console.log("mysql connect succesfully"); 
const [rows] = await db.execute("SHOW DATABASES;");
console.log("Databases:", rows);

