const express = require("express");
const router = express.Router();
const Database = require("./db")

const db = new Database()
db.testConnection()

router.get("/", async (req, res) => {
  const { id, name, email } = req.query;
  let query = "select * from Users"
  let params = []
  let conditions = [];

  try {
    if (id !== undefined) {

      if (!id) {
        return res.status(400).json({ error: 'id はで6ketaしてください' })
      }
      conditions.push("id = ?");
      params.push(id);
    }
    if (name !== undefined) {

      if (typeof (name) != "string") {
        return res.status(400).json({ error: 'name は文字列で指定してください' })
      }
      conditions.push("name = ?");
      params.push(name);
    }
    if (email !== undefined) {
      if (typeof (email) != "string") {
        return res.status(400).json({ error: 'email は文字列で指定してください' })
      }
      conditions.push("email = ?");
      params.push(email);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [users] = await db.pool.query(query, params);
    res.status(200).json(users)
  }
  catch {
    console.error('予期せぬエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
  }
})

router.post('/', async (req, res) => {
  try {
    const { userId, name, email, employee_number, name_kana } = req.body;

    // バリデーション
    if (userId === undefined || name === undefined || email === undefined ||
      employee_number === undefined || name_kana === undefined) {
      return res.status(400).json({ error: 'userId, name, email employee_number name_kana は必須です' });
    }
    const regex = new RegExp("/^[\u3080-\u30FF]+$/")
    if (!regex.test(name_kana)) {
      return res.status(400).json({ error: 'name_kana はカタカナのみ許可されます' });
    }

    await db.pool.query(
      'INSERT INTO Users (id, name, email, employee_number, name_kana) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, name_kana, employee_number]
    );

    res.status(201).json({
      userId,
      name,
      email
    });
  } catch (error) {
    console.error('予期せぬエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, name_kana, employee_number } = req.body;
    const id = req.params.id;
    let query = "UPDATE Users SET "
    let conditions = [];
    let params = []

    if (name) {
      conditions.push("name = ?");
      params.push(name);
    }
    if (email) {
      conditions.push("email = ?");
      params.push(email);
    }
    if (name_kana) {
      const regex = new RegExp("^[\u3080-\u30FF]+$")
      if (regex.test(name_kana)) {
        conditions.push("name_kana = ?");
        params.push(name_kana);
      }
      else {
        console.log(name_kana)
        return res.status(400).json({ error: 'name_kana はカタカナのみ許可されます' });
      }
    }
    if (employee_number) {
      conditions.push("employee_number = ?");
      params.push(employee_number);
    }
    if (conditions.length > 0) {
      query += conditions.join(', ');
      query += " where id = ? "
      params.push(id)
    }

    const [result] = await db.pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ユーザ-が見つかりません' });
    }

    res.status(200).json({
      id,
      name,
      email,
      name_kana,
      employee_number
    });
  } catch (error) {
    console.error('予期せぬエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。システム管理者に問い合わせてください。' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const date = new Date()
    const [result] = await db.pool.query(
      'update Users set deleted_at = ? WHERE id = ?',
      [date, req.params.id]
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

module.exports = router;
