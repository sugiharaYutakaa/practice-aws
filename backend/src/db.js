const mysql = require('mysql2/promise');
class Database{
    constructor(){
        this.dbConfig = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: 3307,
            database: 'skills_management'
        };
        this.pool = mysql.createPool(this.dbConfig);
          
    }
    async testConnection() {
        try {
          const connection = await this.pool.getConnection();
          console.log('MySQL データベースに正常に接続しました');
          connection.release();
        } catch (err) {
          console.error('MySQL 接続エラー:', err);
        }
    }
}
module.exports =  Database