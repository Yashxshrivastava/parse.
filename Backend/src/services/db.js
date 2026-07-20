import mysql from "mysql2/promise";

const DB_NAME = process.env.DB_NAME || "parser";

let pool;

export async function initializeDatabase() {
    // Create database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3307),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();

    // Create pool
    pool = mysql.createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3307),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: DB_NAME,
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS resumes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            raw_text LONGTEXT,
            parsed_json LONGTEXT,
            is_parsed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database ready");
}

export const dbRun = async (sql, params = []) => {
    const [result] = await pool.execute(sql, params);
    return result;
};

export const dbGet = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows[0] || null;
};

export default pool;