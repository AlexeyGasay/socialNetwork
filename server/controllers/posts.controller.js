const db = require("../db");


class PostsController {

  async createPost(req, res) {
    try {

      const { author, username, title_text, text_content, tags } = req.body;
      let newPost = await db.query(
        `INSERT INTO post_list 
                    (author, author_name, title_text, text_content, tags) values ($1, $2, $3, $4, $5) RETURNING *`,
        [author, username, title_text, text_content, tags]);



      return res.json({ post: newPost.rows[0] })



    } catch (e) {
      console.log(e);
      res.status(400).json('Ошибка при создании поста' + e)
    }
  }

  async getAllPosts(req, res) {

    try {
      const news = await db.query(`SELECT * FROM post_list ORDER BY post_id DESC LIMIT 15`);


      return res.json({ data: news.rows, theEnd: false })
    } catch (e) {
      console.log(e);
    }
  }

  // async searchPosts(req, res) {
  //   try {
      
  //     const { } = req.query;

  //     const foundPosts = await db.query(`
  //       SELECT * from
  //     `);

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }


  async loadMorePosts(req, res) {
    try {
      const { lasPostId } = req.query;

      const news = await db.query(`SELECT * FROM post_list WHERE (post_list.post_id < ${+lasPostId}) AND (post_list.post_id > ${+lasPostId - 11})`);

      if (news.rows.length == 0) {
        return res.json({ data: [], theEnd: true })
      }

      const reverseNews = news.rows.reverse();

      res.json({ data: reverseNews, theEnd: false })


    } catch (e) {
      console.log(e);
    }
  }
  // async loadMoreUserPosts(req, res) {
  //   try {
  //     const { user_id, arrLength } = req.query;

  //     const news = await db.query(`
  //       SELECT * FROM post_list
  //       WHERE user_id = ${user_id}
  //       LIMIT 10
  //       OFFSET ${arr}
  //     `);

  //     if (news.rows.length == 0) {
  //       return res.json({ data: [], theEnd: true })
  //     }

  //     const reverseNews = news.rows.reverse();

  //     res.json({ data: reverseNews, theEnd: false })


  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // ПОСТЫ ОПРЕДЕЛЕННОГО ЮЗЕРА
  async getUserPosts(req, res) {
    const user_id = req.query.user_id;
    try {
      const userPosts = await db.query(`SELECT * FROM post_list where author = ${user_id} ORDER BY post_id DESC`);

      res.json(userPosts.rows)
    } catch (e) {
      console.log(e);
    }
  }

  // СПИСОК ID ПОСТОВ КОТОРЫЕ ЛАЙКНУЛ ЮЗЕР
  async getLikedPostsId(req, res) {
    try {
      const user_id = req.query.user_id;

      const likedPosts = await db.query(`SELECT post_id FROM like_list where user_id = ${user_id}`)

      res.json(likedPosts.rows)
    } catch (e) {
      console.log(e);
    }
  }

  // ПОЛУЧИТЬ ЛАЙКНУТЫЕ ПОСТЫ
  async getLikedPosts(req, res) {
    try {
      const user_id = req.query.user_id;

      const likedPostsId = await db.query(`SELECT post_id FROM like_list where user_id = ${user_id}`);


      const postsList = [];

      for (let i = 0; i < likedPostsId.rows.length; i++) {
        const post_id = likedPostsId.rows[i].post_id;

        const likedPost = await db.query(`SELECT * FROM post_list WHERE post_id = ${post_id}`);

        postsList.push(likedPost.rows[0]);
      }



      res.json(postsList)

    } catch (e) {
      console.log(e);
    }
  }

  // КОММЕНТАРИИ К ПОСТАМ
  async sendPostComment(req, res) {

    try {

      const { post_id, author_id, author_username, comment_text } = req.body;

      const sendedPostComment = await db.query(`INSERT INTO post_comments (post_id, author_id, author_username, comment_text) VALUES (${post_id}, ${author_id}, '${author_username}', '${comment_text}')`)

      res.json("Отправлено")

    } catch (e) {
      res.json(e)
      console.log(e);
    }

  }

  async getPostComments(req, res) {

    try {

      const { post_id } = req.query;

      const comments = await db.query(`
        SELECT * FROM post_comments
        WHERE post_id = ${post_id}
        ORDER BY id DESC  
        LIMIT 20
      `);

      // const reverseComments = comments.rows.reverse();


      res.json({ data: comments.rows, theEnd: false })

    } catch (e) {
      console.log(e);
    }

    // const 

  }

  async getMorePostComments(req, res) {

    try {

      const { post_id, arrLength } = req.query;

      let offsetNumber = arrLength;

      if (arrLength == 0) {
        offsetNumber = 20
      }

      const comments = await db.query(`
        SELECT * FROM post_comments
        WHERE post_id = ${post_id}
        ORDER BY id DESC
        LIMIT 20
        OFFSET ${offsetNumber}

      `);

      if (comments.rows.length == 0) {
        return res.json({ data: [], theEnd: true })
      }


      res.json({ data: comments.rows, theEnd: false })

    } catch (e) {
      console.log(e);
    }

    // const 

  }

  async likePost(req, res) {
    try {
      const user_id = req.query.user_id;
      const post_id = req.query.post_id;

      const existLike = await db.query(`SELECT FROM like_list where user_id = ${user_id} AND post_id=${post_id}`);

      if (existLike.rows.length > 0) {
        return res.json("Уже лайкнуто")
      }

      const likedPosts = await db.query(`INSERT INTO like_list (user_id, post_id) values($1, $2) RETURNING *`, [user_id, post_id])

      console.log(likedPosts.rows[0]);

      res.json("ADD LIKE TO " + likedPosts.rows[0].post_id + " post")
    } catch (e) {
      console.log(e);
    }
  }

  async dislikePost(req, res) {
    try {
      const user_id = req.query.user_id;
      const post_id = req.query.post_id;

      const likedPosts = await db.query(`delete from like_list where user_id = ${user_id} AND post_id = ${post_id} RETURNING *`)

      res.json("DELETED LIKE FROM " + likedPosts.rows[0].post_id)
    } catch (e) {
      console.log(e);
    }
  }

  // ПОЛУЧЕНИЕ ЛАЙКОВ ОПРЕДЕЛЕННОГО ПОСТА
  async getLikesPost(req, res) {
    try {
      const post_id = req.query.post_id;

      const likesCount = await db.query(`SELECT * FROM like_list where post_id = ${post_id}`)

      res.json(likesCount.rows.length);

    } catch (e) {
      console.log(e);
    }
  }


  async getPostFiles(req, res) {
    try {
      const post_id = req.query.post_id;

      const files = await db.query(`SELECT * FROM file_to_post where post_id = $1`, [post_id]);

      if (files.rows.length) {
        res.json(files.rows)
      }
      else res.json([])


    } catch (e) {
      console.log(e);
      res.status(403).json(e)
    }

  }
}




module.exports = new PostsController();