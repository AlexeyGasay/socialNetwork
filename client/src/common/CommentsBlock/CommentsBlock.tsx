import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';

import styles from "./comments-block.module.scss"
import CommentItem from './CommentItem/CommentItem';

import { dbURL } from "../../assets/config"

interface ICommentItemProps {
  user_id: string | null;
  post_id: string | number;
}

export interface IComment {
  id: string | number;
  post_id: string | number;
  author_id: string | number;
  author_username: string;
  comment_text: string;

}

const CommentsBlock = ({ user_id, post_id }: ICommentItemProps) => {

  const [comments, setComments] = useState<IComment[]>([]);

  const [commentText, setCommentText] = useState('');

  const { username } = useAppSelector(state => state.userReducer.user);

  const [isDisableSendBtn, setIsDisableSendBtn] = useState<boolean>(false);


  const [isDisableLoadMoreComments, setIsDisableLoadMoreComments] = useState<boolean>(false);
  const [theLastComment, setTheLastComment] = useState<boolean>(false);
  const [offSetCount, setOffSetCount] = useState(0);



  const fetchPostComment = async () => {

    let fetchedArray: any = [];

    await fetch(`${dbURL}/api/postComments?post_id=${post_id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        fetchedArray = data.data;
      });
  

      if (fetchedArray.length > 0) {
        
        let lastStateComments = comments.slice(-20); 
        let fetchedComments: any[] = fetchedArray.slice();

        for (let index = 0; index < lastStateComments.length; index++) {
          const commentId = lastStateComments[index].id;

          fetchedComments = fetchedComments.filter(el => el.id != commentId);
          
        }

        setComments(prev => [...fetchedComments, ...prev])
        
      }

    }
  

  const fetchMorePostComments = async () => {

    console.log(theLastComment);
    

    if (theLastComment == true) {
      return alert("Комментариев больше нет.")
    }

    await fetch(`${dbURL}/api/loadMorePostComments?post_id=${post_id}&arrLength=${comments.length}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setComments(prev => [...prev, ...data.data])
        setTheLastComment(data.theEnd)
      })

    setIsDisableLoadMoreComments(true);

    setTimeout(() => {
      setIsDisableLoadMoreComments(false);
    }, 1500);


  }


  const sendPostcomment = () => {

    if (!user_id) {
      return alert("Войдите в профиль для отправки комментриев")
    }

    else if (commentText.length == 0) {
      return alert("Введите комментарий")
    }

    let body = {
      post_id: post_id,
      author_id: user_id,
      author_username: username,
      comment_text: commentText
    }


    fetch(`${dbURL}/api/postComment`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => console.log(data)
      );

    setCommentText('');
    setIsDisableSendBtn(true);

    setTimeout(() => {
      setIsDisableSendBtn(false)
    }, 1500)
  }



  useEffect(() => {
    fetchPostComment();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchPostComment();
    }, 1500)

    return () => clearInterval(interval)
  });


  useLayoutEffect(() => {
    fetchMorePostComments();
  }, [offSetCount])



  return (
    <div className={styles.comment_block}>

      <div className={styles.commment_input_block}>

        <input
          className={styles.commment_input}
          placeholder={"Введите текст комментария"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          type="text"
        />

        <button className={styles.commment_send_btn} disabled={isDisableSendBtn} onClick={() => sendPostcomment()} >Отправить</button>
      </div>

      <div className={styles.comment_container}>

        {
          comments.length > 0 ?

            comments.map(comment => {
              return (
                <CommentItem
                  key={comment.id}
                  id={comment.id}
                  post_id={comment.post_id}
                  author_id={comment.author_id}
                  author_username={comment.author_username}
                  comment_text={comment.comment_text}
                />
              )
            })

            :
            <p className={styles.no_comments}>Здесь еще нет комментраиев</p>

        }

        <button
          className={styles.load_more_comments}
          onClick={() => setOffSetCount(prev => prev += 1)}
          disabled={isDisableLoadMoreComments}
        >
          Загрузить еще
        </button>

      </div>

    </div>
  );
};

export default React.memo(CommentsBlock);