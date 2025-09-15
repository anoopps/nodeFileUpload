import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((error) => {
    if (error) {
        console.log("Database connection failed ");
        process.exit(1);
    }
    console.log("Database connection Succesfull");
});

export default db;