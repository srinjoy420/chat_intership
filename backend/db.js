import mysql from "mysql2/promise";
import dotenv from "dotenv"
dotenv.config()

export const db = await mysql.createConnection({
    host: process.env.HOSt,
    user: process.env.USER,
    password: process.env.MY_SQL_PASSWORD,
    database: "chatapp"
});

console.log("mysql connect succesfully"); 
const [rows] = await db.execute("SHOW DATABASES;");
console.log("Databases:", rows);

