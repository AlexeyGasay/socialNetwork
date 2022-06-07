import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dbURL } from '../../assets/config';
import PostItem from '../../common/PostItem/PostItem';
import { fetchFriendRequest } from '../../redux/asyncActions/fetchFriends';
import { fetchUserPosts } from '../../redux/asyncActions/fetchPosts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import MessageModal from './MessageModal/MessageModal';

import styles from "./user-page.module.scss"

interface IUserInfo {
  user_id: string | number;
  username: string;
  user_avatar: string | null;
  
}

const UserPage = () => {

  const { user_id_param }: any = useParams()

  const dispatch = useAppDispatch();

  const { userPosts } = useAppSelector(state => state.postsReducer);
  const { user_id } = useAppSelector(state => state.userReducer.user);

  const [userInfo, setUserInfo] = useState<IUserInfo[]>([]);

  const [isOpenMsgModal, setIsOpenMsgModal] = useState<boolean>(false);

  const checkPerson = () => {

    if (!user_id) {
      return false;
    }
    else if (user_id == user_id_param) {
      return false;
    }
    else return true
  }

  const sendFriendRequest = () => {
    let body = {
      sender: user_id,
      recipient: user_id_param
    }
    fetchFriendRequest(body);
  }


  useEffect(() => {
    dispatch(fetchUserPosts(user_id_param))
  }, []);

  useEffect(() => {
    fetch(`${dbURL}/api/getUserInfo?user_id=${user_id_param}`)
      .then(res => res.json())
      .then(data => setUserInfo(data))
  }, [])




  return (
    <div>
      <div className={styles.user_page}>

        <div className={styles.user_info_block}>

          <div className={styles.user_background}>

            <div className={styles.user_avatar_block} >

              <img className={styles.user_avatar} src={`${dbURL}/static/file_1654512649611.jpeg`} alt="user_avatar" />

            </div>

          </div>

          <div className={styles.user_info}>
            <p className={styles.user_status}>{userInfo[0].username}</p>
          </div>

          {checkPerson() ?

            <div className={styles.user_handle_block}>
              <button
                className={styles.handle_block__btn}
                onClick={() => setIsOpenMsgModal(!isOpenMsgModal)}
              >
                Отправить сообщение
              </button>

              <button
                className={styles.handle_block__btn}
                onClick={() => sendFriendRequest()}
              >
                Дружить
              </button>
            </div>


            : null

          }

        </div>

        <div className={styles.user_posts}>
          {userPosts.length ?
            userPosts.map((item) => {
              return (
                <PostItem
                  key={item.post_id}
                  author={item.author}
                  author_name={item.author_name}
                  post_id={item.post_id}
                  title_text={item.title_text}
                  text_content={item.text_content}
                  tags={item.tags}

                />
              )
            })
            :
            <p className={styles.no_posts}>У данного пользователя еще нет постов</p>

          }
        </div>

        <MessageModal isOpen={isOpenMsgModal} toggle={setIsOpenMsgModal} />

      </div>
    </div>
  );
};

export default UserPage;