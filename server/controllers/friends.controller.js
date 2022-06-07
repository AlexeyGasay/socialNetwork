const db = require("../db");

class FriendsController {

  async sendFriendRequest(req, res) {
    try {
      const { sender, recipient } = req.body;


      const existRequest = await db.query
        (
          `
          SELECT * FROM friends 
          WHERE 
          (friend_one = ${sender} OR friend_two = ${sender})
          AND
          (friend_one = ${recipient} OR friend_two = ${recipient})
          `
        );

      if (existRequest.rows.length > 0) {
        return res.json("Заявка уже существует, проверьте заявки")
      }

      const newFriendRequest = await db.query(`INSERT INTO friends (friend_one, friend_two) values ($1, $2)`, [sender, recipient]);
      res.json("Заявка отправлена");

    } catch (e) {
      console.log(e);
    }
  }



  async getMyFriendsAndRequests(req, res) {

    // СТАТУСЫ ЗАЯВОК: 0 - в ожидании, 1 - друг, 2 - отклонено 

    try {
      const user_id = req.query.user_id;

      let fromUserFriendRequests = []; // Исходящие заявки пользователя

      let toUserFriendRequests = []; // Входящие заявки пользователя

      let friendsList = [];


      // ПОЛУЧИТЬ ВСЕ СВЯЗАННЫЕ С ЮЗЕРОМ ЗАЯВКИ 
      const requestsList = await db.query(`
            SELECT * FROM friends
            WHERE 
            friend_one = ${user_id} OR friend_two = ${user_id}
          `);



      // ПРОЙТИСЬ ПО ЗАЯВКАМ, ПОЛУЧИТЬ ЗАЯВКИ И ДРУЗЕЙ И ОТПРАВИТЬ

      for (let i = 0; i < requestsList.rows.length; i++) {
        const el = requestsList.rows[i];
        let user = await db.query(`SELECT user_id, username FROM user_list where user_id = ${el.friend_two}`);


        // ИСХОДЯЩИЕ ЗАЯВКИ 
        if (el.friend_one == user_id && (el.status == 0 || el.status == 2)) {
          fromUserFriendRequests.push(user.rows[0]);
        }

        // ДРУЗЬЯ ПОЛЬЗОВАТЕЛЯ 
        else if (el.status == 1) {
          // ПРОВЕРКА ГДЕ ИМЕННО ДРУГ
          let userId;
          if (el.friend_one == user_id) {
            userId = el.friend_two;
          }
          else userId = el.friend_one;

          let user = await db.query(`SELECT user_id, username FROM user_list where user_id = ${userId}`);

          friendsList.push(user.rows[0])
        }

        // ВХОДЯЩИЕ ЗАЯВКИ
        else if (el.friend_two == user_id && el.status == 0) {
          let user = await db.query(`SELECT user_id, username FROM user_list where user_id = ${el.friend_one}`);
          toUserFriendRequests.push(user.rows[0]);
        }

      }

      res.json({
        friends: friendsList,
        userRequests: fromUserFriendRequests,
        toUserRequests: toUserFriendRequests
      })

    } catch (e) {
      console.log(e);
    }
  }


  async acceptOrDeclineFriendRequest(req, res) {
    try {
      const { sender, recipient, status } = req.body;

      if (status == 2) {
        await db.query(`DELETE FROM friends WHERE (friend_one = ${sender} OR friend_two = ${sender}) AND (friend_one = ${recipient} OR friend_two = ${recipient}) `);
        return res.json("Заявка удалена")
      }

      const updatedRequest = await db.query(`
        UPDATE friends 
        SET status = ${status}
        WHERE
        friend_one = ${sender} AND friend_two = ${recipient}
        
      `);

      res.json("Заявка принята")

    } catch (e) {
      console.log(e);
    }
  }



}


module.exports = new FriendsController();

