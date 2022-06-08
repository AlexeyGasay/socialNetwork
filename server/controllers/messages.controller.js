const db = require("../db");

class MessagesController {

  async getContacts(req, res) {

    try {

      const user_id = req.query.user_id;

      const contactsList = [];

      const userContacts = await db.query(`SELECT DISTINCT sender, recipient FROM message_list WHERE (sender = ${user_id}) OR (recipient = ${user_id})`);

      // SELECT DISTINCT sender, recipient FROM message_list WHERE sender = 1 OR recipient = 1;

      // ПРОВЕРКА НА СУЩЕСТВОВАНИЕ КОНТАКТА
      const checkSame = (el) => {

        let unique = true;

        if (contactsList.length > 0) {
          for (let i = 0; i < contactsList.length; i++) {
            const elemId = contactsList[i].user_id;

            if (elemId == el.sender || elemId == el.recipient) {
              return unique = false;

            }
          }

        }

        return unique;
      }


      for (let i = 0; i < userContacts.rows.length; i++) {
        const el = userContacts.rows[i];

        let unique = checkSame(el);

        if ((el.sender == user_id) && (unique == true)) {
          let contact = await db.query(`SELECT user_list.user_id, user_list.username FROM user_list WHERE user_id = ${el.recipient}`);
          contactsList.push(contact.rows[0])
        }

        else if ((el.sender != user_id) && (unique == true)) {
          let contact = await db.query(`SELECT user_list.user_id, user_list.username FROM user_list WHERE user_id = ${el.sender}`);
          contactsList.push(contact.rows[0])
        }

      }

      res.json(contactsList)

    } catch (e) {
      console.log(e);
    }
  }


  async getLastMessages(req, res) {

    try {

      const { sender, recipient } = req.query;

      const messages = await db.query(`
        SELECT * FROM message_list
        WHERE (sender = ${sender} OR recipient = ${sender})
        AND (sender = ${recipient} OR recipient = ${recipient})
        ORDER BY id DESC
        LIMIT 10
        `);

      const resMessages = messages.rows.reverse();

      res.json(resMessages);

    } catch (e) {
      console.log(e);
    }

  }

  async getOlderMessages(req, res) {

    try {
      const { sender, recipient, arrLength } = req.query;

      let limit = 40;

      // УЗНАЕМ КОЛИЧЕСТВО ВСЕХ СМС
      const allMessages = await db.query(`
        SELECT * FROM message_list
        WHERE (sender = ${sender} OR recipient = ${sender})
        AND (sender = ${recipient} OR recipient = ${recipient})`
      );

      let allMessagesLength = allMessages.rows.length;


      if (+arrLength >= allMessagesLength) {
        let finalMessages = await db.query(`
          SELECT * FROM message_list
          WHERE (sender = ${sender} OR recipient = ${sender})
          AND (sender = ${recipient} OR recipient = ${recipient})
          ORDER BY id DESC
          LIMIT ${limit}
          OFFSET ${arrLength}
          `);

        return res.json({ data: finalMessages.rows, theEnd: true })
      }


      const messages = await db.query(`
          SELECT * FROM message_list
          WHERE (sender = ${sender} OR recipient = ${sender})
          AND (sender = ${recipient} OR recipient = ${recipient})
          ORDER BY id DESC
          LIMIT ${limit}
          OFFSET ${arrLength}
        `);


      let newMessages = messages.rows.reverse();

      res.json({ data: newMessages, theEnd: false })

    } catch (e) {
      console.log(e);
    }


  }


  async sendMessage(req, res) {

    try {

      const { sender, recipient, message_text, create_time } = req.body;

      const newMessage = await db.query(`INSERT INTO message_list (sender, recipient, message_text, create_time) values ($1, $2, $3, $4) RETURNING *`, [sender, recipient, message_text, create_time])

      res.json(newMessage.rows)

    } catch (e) {
      console.log(e);
    }

    // INSERT INTO message_list (sender, recipient, message_text, create_time) values (2, 3, 'opoposapod', '12.11');
  }

}

module.exports = new MessagesController();