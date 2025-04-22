const express = require("express");
const router = express.Router();
const Database = require("./db")

const db = new Database()
db.testConnection()

router.get("/", async (req, res) => {
    const { exp, level, user_id, skill_name, user_name } = req.query;
    let query = "select UserSkills.id,Skills.skill,UserSkills.level,UserSkills.experience,Users.name,Users.email from UserSkills"
    query += " inner join Users on Users.id = UserSkills.user_id "
    query += " inner join Skills on Skills.id = UserSkills.skill_id "
    let params = []
    let conditions = [];

    try {
        if (skill_name !== undefined) {
            conditions.push("Skills.skill LIKE ?");
            params.push(skill_name + '%');
        }

        // ユーザー名の部分一致
        if (user_name !== undefined) {
            conditions.push("Users.name LIKE ?");
            params.push('%' + user_name + '%');
        }
        if (exp !== undefined) {
            const expValue = parseInt(exp);

            if (isNaN(expValue)) {
                return res.status(400).json({ error: '経験年数 exp は数値で指定してください' })
            }
            conditions.push("experience >= ?");
            params.push(expValue);
        }
        if (level !== undefined) {
            const levelValu = parseInt(level);

            if (isNaN(levelValu)) {
                return res.status(400).json({ error: 'レベル level は数値で指定してください' })
            }
            conditions.push("level >= ?");
            params.push(levelValu);
        }
        if (level !== undefined) {
            const levelValu = parseInt(level);

            if (isNaN(levelValu)) {
                return res.status(400).json({ error: 'レベル level は数値で指定してください' })
            }
            conditions.push("level >= ?");
            params.push(levelValu);
        }
        if (user_id !== undefined) {
            const user_id_value = parseInt(user_id);

            if (isNaN(user_id_value)) {
                return res.status(400).json({ error: 'レベル level は数値で指定してください' })
            }
            conditions.push("user_id = ?");
            params.push(user_id_value);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [skills] = await db.pool.query(query, params);
        res.status(200).json(skills)
    }
    catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.pool.query(
            'SELECT * FROM UserSkills WHERE id = ?',
            [req.params.id]
        );


        const userSkill = rows[0]; // 取得したスキル情報


        if (!userSkill) {
            return res.status(404).json({ error: 'ユーザースキルが見つかりません' });
        }


        return res.status(200).json(userSkill);
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { userId, skillId, level, experience } = req.body;

        // バリデーション
        if (!userId || skillId === undefined || level === undefined || experience === undefined) {
            return res.status(400).json({ error: 'userId, skillId, level, experience は必須です' });
        }

        await db.pool.query(
            'INSERT INTO UserSkills (user_id, skill_id, level, experience) VALUES (?, ?, ?, ?)',
            [userId, skillId, level, experience]
        );

        res.status(201).json({
            userId,
            skillId,
            level,
            experience
        });
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { level, experience } = req.body;
        const id = req.params.id;

        // バリデーション
        if (level === undefined || experience === undefined) {
            return res.status(400).json({ error: 'level, experience は必須です' });
        }

        const [result] = await db.pool.query(
            'UPDATE UserSkills SET level = ?, experience = ? WHERE id = ?',
            [level, experience, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'ユーザースキルが見つかりません' });
        }

        res.status(200).json({
            id,
            level,
            experience
        });
    } catch (error) {
        console.error('予期せぬエラー:', error);
        return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.pool.query(
            'DELETE FROM UserSkills WHERE id = ?',
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