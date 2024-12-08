// dbConfig.js
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 4,
    host: process.env.DB_HOST || 'beyokj9jopaygfbw9j8i-mysql.services.clever-cloud.com',
    user: process.env.DB_USER || 'beyokj9jopaygfbw9j8i',
    password: process.env.DB_PASSWORD || 'u0kizdyccrms8r6s',
    database: process.env.DB_NAME || 'beyokj9jopaygfbw9j8i',
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    queueLimit: 0,
    debug: false,
    acquireTimeout: 30000
});

// Wrapper para promesas que mantiene la compatibilidad con el código existente
const query = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

// Wrapper para transacciones
const transaction = async (callback) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) reject(err);
            resolve(conn);
        });
    });

    try {
        await new Promise((resolve, reject) => {
            connection.beginTransaction(err => {
                if (err) reject(err);
                resolve();
            });
        });

        const result = await callback(connection);
        
        await new Promise((resolve, reject) => {
            connection.commit(err => {
                if (err) reject(err);
                resolve();
            });
        });

        return result;
    } catch (error) {
        await new Promise(resolve => {
            connection.rollback(() => resolve());
        });
        throw error;
    } finally {
        connection.release();
    }
};

// Monitoreo de conexiones
pool.on('acquire', function (connection) {
    console.log('Conexión %d adquirida', connection.threadId);
});

pool.on('connection', function (connection) {
    console.log('Nueva conexión establecida');
});

pool.on('release', function (connection) {
    console.log('Conexión %d liberada', connection.threadId);
});

module.exports = {
    pool,
    query,
    transaction
};