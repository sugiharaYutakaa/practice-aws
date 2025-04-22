const express = require("express");
const router = express.Router();
const Database = require("./db")

const db = new Database()
db.testConnection()

router.get("/",async (req,res)=>{
    const {id,category} = req.query;
    let query = "select * from Categories"
    let params = []
    let conditions = [];

    try{
        if(id !== undefined)
        {
            const idValue = parseInt(id);
            
            if(isNaN(idValue)){
                return res.status(400).json({error: 'id は数値で指定してください'})
            }
            conditions.push("id = ?");
            params.push(idValue);
        }
        if(category !== undefined)
        {
            
            if(typeof(category) != "string"){
                return res.status(400).json({error: 'category は文字列で指定してください'})
            }
            conditions.push("name = ?");
            params.push(category);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
    
        const [users] = await db.pool.query(query,params);
        res.status(200).json(users)
    }
    catch{
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
})


module.exports = router;
