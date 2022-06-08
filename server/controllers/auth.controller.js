const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");


const generateAccessToken = (user_id) => {
  const payload = {
    user_id
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}


class authController {
  async registration(req, res) {
    try {
      const { username, password } = req.body;
      const candidate = await db.query('SELECT * FROM USER_LIST WHERE username = $1', [username]);

      if (candidate.rows.length) {
        return res.json({ message: "Пользователь уже существует", status: false })
      }

      // Если не занят username
      const hashPassword = bcrypt.hashSync(password, 7);

      const newUser = await db.query(
        'INSERT INTO USER_LIST (username, password) VALUES ($1, $2)  RETURNING *', [username, hashPassword]);
      res.json({ user: newUser.rows[0], status: true });

    } catch (e) {
      console.log(e);
      res.status(400).json("Error " + e)
    }
  }





  async login(req, res) {

    try {
      const { username, password } = req.body;

      // Поиск в бд юзера по username
      const user = await db.query('SELECT * FROM USER_LIST where username = $1', [username]);

      if (user.rows.length == 0) {
        return res.status(400).json({ status: false, message: "Такого пользователя не существует, проверьте значение" });
      }

      console.log(user.rows[0])

      // Сравнение паролей
      const validPassword = bcrypt.compareSync(password, user.rows[0].password)

      if (!validPassword) {
        return res.status(400).json({ status: false, message: "Введен неверный пароль" });
      }

      // Генерация токета 
      const token = generateAccessToken(user.rows[0].user_id)

      return res.json({ status: true, token: token, user: user.rows[0] });

    } catch (e) {
      console.log(e);
      res.status(400).json("Error " + e)
    }
  }

  async getUsers(req, res) {
    try {
      const USER_LIST = await db.query('SELECT * FROM USER_LIST');

      return res.json(USER_LIST.rows);
    } catch (e) {
      console.log(e);
      res.status(400).json("Error " + e)
    }
  }
}


module.exports = new authController();