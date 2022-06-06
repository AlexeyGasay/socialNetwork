import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSendMessage } from '../../../redux/asyncActions/fetchMessages';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

import "./message-modal.css" 
import styles from "./message-modal.module.scss"


interface IMessageModalProps {
  isOpen: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}



const MessageModal = ({ isOpen, toggle }: IMessageModalProps) => {

  const dispatch = useAppDispatch();


  const { user_id } = useAppSelector(state => state.userReducer.user)
  const { user_id_param } = useParams()

  const [messageText, setMessageText] = useState<string>("");


  const sendMessage = () => {
    
    let text = messageText.trim();

    if (text.length == 0 || user_id == null) {
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
      recipient: user_id_param,
      message_text: text,
      create_time: currentDate
    }

    dispatch(fetchSendMessage(body));

    setMessageText("")

    alert("Проверьте свои контакты")

  }

  let messageModalBlockClasses = [styles.message_modal_block, isOpen ? "visible": "hidden"].join(" ");  

  return (
    <div className={messageModalBlockClasses} onClick={() => toggle(!isOpen)}>

      <div className={styles.message_modal} onClick={event => event.stopPropagation()}>

        <div className={styles.modal_input_block}>

          <textarea
            className={styles.message_input}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите сообщение"
          />

        </div>

        <div className={styles.modal_handle_block}>

          <button
            className={styles.message_btn + " " + styles.message_close_btn}
            onClick={() => toggle(!isOpen)}
          >Закрыть
          </button>

          <button
            className={styles.message_btn + " " + styles.message_send_btn}
            onClick={() => sendMessage()}
          >
            Send Message
          </button>

        </div>
      </div>
    </div>
  );
};

export default MessageModal;