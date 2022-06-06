import React from 'react';
import { useAppSelector } from '../../../redux/hooks';

import styles from "./message-item.module.scss"

const MessageItem = (
  {
    id,
    sender,
    message_text,
    create_time

  }: any
) => {


  const { user_id } = useAppSelector(state => state.userReducer.user);  

  return (
    <>
      {sender == user_id ?
        <div className={[styles.message_block, styles.my_message_block].join(" ")}>
          <p className={[styles.my_message, styles.message].join(" ")}>

            {message_text}

            <span className={styles.create_time}> {create_time} </span>

          </p>
        </div>
        :

        <div className={[styles.message_block, styles.to_me_message_block].join(" ")}>
          <p className={[styles.to_me_message, styles.message].join(" ")}>

            {message_text}

            <span className={styles.create_time}> {create_time} </span>

          </p>
        </div>

      }

    </>
  );
};


export default React.memo(MessageItem);