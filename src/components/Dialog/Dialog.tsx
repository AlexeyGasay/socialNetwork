import React, { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLastMessages, fetchMessages, fetchSendMessage } from '../../redux/asyncActions/fetchMessages';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearMessages } from '../../redux/slices/userSlice';

import styles from "./dialog.module.scss"
import MessageItem from './MessageItem/MessageItem';


const Dialog = () => {

  const { contact_id } = useParams();

  let topAnchor = useRef<HTMLDivElement>(null);
  let bottomAnchor = useRef<HTMLDivElement>(null);

  // КОЛИЧЕСТВО ПОДГРУЗОК/СКОЛЬКО ПРОПУСТИТЬ ПРИ ВЫБОРКЕ

  const dispatch = useAppDispatch();

  const [disable, setDisable] = useState(false)

  const { messages } = useAppSelector(state => state.userReducer);
  const { user_id, username } = useAppSelector(state => state.userReducer.user);

  // ОСТАЛИСЬ ЛИ ЕЩЕ СООБЩЕНИЯ В КОНЦЕ (TRUE = БОЛЬШЕ СТАРЫХ СООБЩЕНИЙ НЕТ)
  const { theEnd } = useAppSelector(state => state.userReducer);

  const [loadCount, setLoadCount] = useState(0);

  const [messageText, setMessageText] = useState<string>("");


  const scrollTo = (position: string) => {

    let top = topAnchor.current;
    let bottom = bottomAnchor.current;


    if (position == "top") {
      top?.scrollIntoView({ behavior: "smooth" });
    }

    else if (position == "bottom") {
      bottom?.scrollIntoView({ behavior: "auto" });
    }

  }

  const sendMessage = () => {

    if (messageText.trim().length == 0 || user_id == null) {
      return alert("Сообщение пустое")
    }

    let date = new Date();

    let currentDate =
      date.getFullYear()
      + '-' +
      (date.getMonth() + 1)
      + '-' +
      date.getDate()
      + ' ' +
      date.getHours()
      + ':' +
      date.getMinutes();


    let body = {
      sender: user_id,
      recipient: contact_id,
      message_text: messageText.trim(),
      create_time: currentDate
    }

    dispatch(fetchSendMessage(body));

    setMessageText("")

    scrollTo("bottom")

  }


  const loadMore = () => {

    if (theEnd) {
      return alert("Сообщений больше нет.")
    }

    setDisable(true);

    setLoadCount(prev => prev += 1)

    setTimeout(() => {
      setDisable(false)
    }, 1500)

  }


  // ПОДГРУЗКА НОВЫХ СМС
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchLastMessages(user_id, contact_id))
    }, 1000);

    return () => clearInterval(interval);
  }, [])


  // ЗАГРУЗКА/ПОДГРУЗКА ПРЕДЫДУЩИХ СООБЩЕНИЙ СООБЩЕНИЙ 
  useEffect(() => {
    dispatch(fetchMessages(user_id, contact_id, loadCount, messages.length, false))

  }, [loadCount])



  // СКРОЛЛ ВНИЗ
  useLayoutEffect(() => {
    scrollTo("bottom")
  }, [])

  // ОЧИСТКА СМС
  useEffect(() => {
    return () => {
      dispatch(clearMessages())
    }
  }, [])


  return (
    <div className={styles.dialog} >

      <div className={styles.messages_block} >

        <div className={styles.topAnchor} ref={topAnchor} ></div>

        <button className={styles.loadMore} onClick={() => loadMore()} disabled={disable} >Загрузить еще</button>

        {messages.map((message) => {

          return (
            <MessageItem
              key={message.id}
              id={+message.id}
              sender={message.sender}
              message_text={message.message_text}
              create_time={message.create_time}


            />
          )


        })
        }


        <div className={styles.bottomAnchor} ref={bottomAnchor} ></div>

      </div>



      <div className={styles.input_block} >
        <textarea
          className={styles.message_input}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Сообщение"
        />

        <button className={styles.message_send_btn} onClick={() => sendMessage()} >{">"}</button>

      </div>


    </div>
  );
};




export default Dialog;