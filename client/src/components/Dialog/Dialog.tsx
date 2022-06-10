import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Preloader from '../../assets/Preloader/Preloader';
import { fetchLastMessages, fetchMessages, fetchSendMessage } from '../../redux/asyncActions/fetchMessages';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearMessages, logOut } from '../../redux/slices/userSlice';

import MessageItem from './MessageItem/MessageItem';

import styles from "./dialog.module.scss"
import "./dialog.css"

const Dialog = () => {

  const { contact_id } = useParams();

  let messageBlock = useRef<HTMLDivElement>(null);
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

  const [bottomScrollVisible, setBottomScrollVisible] = useState(true);

  const [messageText, setMessageText] = useState<string>("");



  const scrollTo = (position: string) => {

    // let top = topAnchor.current;
    let bottom = bottomAnchor.current;

    let bottomScroll: number = 0;
    let msgBlock = messageBlock.current;

    if (msgBlock != null || msgBlock != undefined) {
      bottomScroll = (msgBlock.scrollHeight - msgBlock.scrollTop) - msgBlock.clientHeight;

    }



    setTimeout(() => {
      if (position == "bottom" && bottomScroll < 500) {
        bottom?.scrollIntoView({ behavior: "auto" });
      }

      else if (position == "scrollDown") {
        bottom?.scrollIntoView({ behavior: "smooth" });
      }

    }, 200)




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

  const showBottomScroll = () => {
    let bottomScroll: number = 0;
    let msgBlock = messageBlock.current;

    if (msgBlock != null || msgBlock != undefined) {
      bottomScroll = (msgBlock.scrollHeight - msgBlock.scrollTop) - msgBlock.clientHeight;
    }

    if (bottomScroll > 500) {
      setBottomScrollVisible(true)
    } else {
      setBottomScrollVisible(false)
    }



  }

  // console.log(bottomAnchor.current);
  // console.log(messages);
  
  

  // ПОДГРУЗКА НОВЫХ СМС
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchLastMessages(user_id, contact_id));

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
  }, [messages, bottomAnchor.current])

  // ОЧИСТКА СМС
  useEffect(() => {
    return () => {
      dispatch(clearMessages())
    }
  }, [])


  let toBottomBtnClasses = [styles.to_bottom_btn, bottomScrollVisible ? "visible" : "hidden"].join(" ");

  return (
    <div className={styles.dialog} >

      <div onScroll={() => showBottomScroll()} ref={messageBlock} className={styles.messages_block} >

        <div className={styles.topAnchor} ref={topAnchor} ></div>

        <button className={styles.loadMore} onClick={() => loadMore()} disabled={disable} >Загрузить еще</button>

        {messages.length ?

          messages.map((message) => {

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

          :
          <Preloader />
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

        <button className={toBottomBtnClasses} onClick={() => scrollTo("scrollDown")}>
          <span className={styles.span_container}>
            <span className={styles.first_span}></span>
            <span className={styles.second_span}></span>
          </span>
        </button>

      </div>


    </div>
  );
};




export default Dialog;