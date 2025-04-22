const express = require("express");
const router = express.Router();
const Database = require("./db")

const db = new Database()
db.testConnection()

router.get("/",async (req,res)=>{
    const {id,skill_name,category_name} = req.query;
    let query = "select * from Skills"
    query += " inner join Categories on Categories.id = Skills.category_id "
    let params = []
    let conditions = [];

    try{
        if (skill_name !== undefined) {
            conditions.push("Skills.skill LIKE ?");
            params.push(skill_name + '%');
        }
    
        if (category_name !== undefined) {
            conditions.push("Categories.category LIKE ?");
            params.push('%' + category_name + '%');
        }
        if(id !== undefined)
        {
            const id_value = parseInt(id);
            
            if(isNaN(id_value )){
                return res.status(400).json({error: 'id は数値で指定してください'})
            }
            conditions.push("id = ?");
            params.push(id_value);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [skills] = await db.pool.query(query,params);
        res.status(200).json(skills)
    }
    catch(error){
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
})

router.get('/:id', async(req, res) => {
    try {
        const [rows] = await db.pool.query(
        'SELECT * FROM Skills WHERE id = ?',
        [req.params.id]
        );


        const Skill = rows[0]; 


        if (!Skill) {
            return res.status(404).json({ error: 'ユーザースキルが見つかりません' });
        }


        return res.status(200).json(Skill);
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});
router.post('/', async (req, res) => {
    try {
        const {skill_name,category_id } = req.body;
    
        // バリデーション
        if (!skill_name === undefined || category_id === undefined) {
            return res.status(400).json({ error: 'skiill_name,category_id は必須です' });
        }
    
        await db.pool.query(
            'INSERT INTO Skills (skill,category_id) VALUES (?, ?)',
            [skill_name,category_id]
        );
    
        res.status(201).json({
            skill_name,
            category_id
        });
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

router.put('/:id', async (req, res) => {
    try {
    const { skill_name,category_id } = req.body;
    const id = req.params.id;
    
    if ( skill_name === undefined || category_id === undefined) {
        return res.status(400).json({ error: ' skill_name,category_id は必須です' });
    }
    
    const [result] = await db.pool.query(
        'UPDATE Skills SET skill = ?, category_id = ? WHERE id = ?',
        [ skill_name,category_id, id]
    );
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'ユーザースキルが見つかりません' });
    }
    
    res.status(200).json({
        id,
        skill_name,
        category_id
    });
    } catch (error) {
    console.error('予期せぬエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
    const [result] = await db.pool.query(
        'DELETE FROM Skills WHERE id = ?',
        [req.params.id]
    );
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'ユーザースキルが見つかりません' });
    }
    
    res.status(204).end();
    } catch (error) {
    console.error('予期せぬエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

module.exports = router