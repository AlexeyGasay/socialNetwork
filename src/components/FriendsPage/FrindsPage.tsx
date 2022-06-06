import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbURL } from '../../assets/config';
import { fetchAcceptOrDeclineFriendRequest, fetchFriendsAndRequests } from '../../redux/asyncActions/fetchFriends';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from "./friends-page.module.scss"



const FrindsPage = () => {

  const dispatch = useAppDispatch();

  // 0 - ДРУЗЬЯ, 1 - ЗАЯВКИ ЮЗЕРА, 2 - ЗАЯВКИ К ЮЗЕРУ
  const [status, setStatus] = useState(0)

  const { friends, toUserFriendRequests, userFriendRequests } = useAppSelector(state => state.userReducer);

  const { user_id } = useAppSelector(state => state.userReducer.user);


  const acceptOrDeclineFriendRequest = (sender: any, recipient: any, status: number) => {

    let body = {
      sender: sender,
      recipient: recipient,
      status: status
    }

    let isSure;


    isSure = window.confirm("Вы уверены ?");

    if (isSure == true) {
      dispatch(fetchAcceptOrDeclineFriendRequest(body));
    }

  }


  const renderFriendsAndRequests = () => {
    let array: any[] = [];
    if (status == 0) {
      array = friends;
    }
    else if (status == 1) {
      array = userFriendRequests;
    }

    else if (status == 2) {
      array = toUserFriendRequests;
    }


    return <div className={styles.friends_list}>

      {array.length > 0 ?
        array.map(el => {

          return (
            <div key={el.user_id} className={styles.user}>

              <div className={styles.user_info}>

                <Link className={styles.user_avatar} id={"user_avatar"} to={`/user/${el.user_id}`}>
                  <img  src={`${dbURL}/static/file_1653909204304.jpg`} alt="user_avatar" />
                </Link>

                <Link className={styles.username} id={"user_avatar"} to={`/user/${el.user_id}`}>
                  {el.username}
                </Link>

              </div>


              <div className={styles.user_handlers}>

                {/* ДРУЗЬЯ */}
                {status == 0 ?
                  <>
                    <button className={styles.user_handlers__btn} onClick={() => acceptOrDeclineFriendRequest(user_id, el.user_id, 2)} >Удалить из друзей</button>
                  </>
                  :
                  null
                }

                {/* ОЖИДАЮЩИЕ */}
                {status == 2 ?
                  <>
                    <button className={styles.user_handlers__btn} onClick={() => acceptOrDeclineFriendRequest(el.user_id, user_id, 1)} >Принять</button>
                    <button className={styles.user_handlers__btn} onClick={() => acceptOrDeclineFriendRequest(el.user_id, user_id, 2)} >Отклонить</button>
                  </>
                  :
                  null
                }

                {/* ОТПРАВЛЕННЫЕ */}
                {status == 1 ?
                  <>
                    <button className={styles.user_handlers__btn} onClick={() => acceptOrDeclineFriendRequest(user_id, el.user_id, 2)} >Удалить заявку</button>
                  </>
                  :
                  null
                }
              </div>
            </div>

          )
        })
        :
        <p>Здесь пока что пусто</p>
      }
    </div>

  }

  useEffect(() => {
    dispatch(fetchFriendsAndRequests(user_id))
  }, [user_id])



  let friendsHandlerClasses = [styles.selected, styles.friends_handler__item].join(" ");


  return (
    <div>
      <div className={styles.friends_handler}>
        <ul className={styles.friends_handler__nav}>
          <li onClick={() => setStatus(0)} className={status == 0 ? friendsHandlerClasses : styles.friends_handler__item}>Друзья</li>
          <li onClick={() => setStatus(1)} className={status == 1 ? friendsHandlerClasses : styles.friends_handler__item}>Отправленные</li>
          <li onClick={() => setStatus(2)} className={status == 2 ? friendsHandlerClasses : styles.friends_handler__item}>Ожидающие</li>
        </ul>
      </div>



      {renderFriendsAndRequests()}





    </div>
  );
};

export default FrindsPage;