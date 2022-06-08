import React from 'react';
import { Link } from 'react-router-dom';
import { IComment } from '../CommentsBlock';

import styles from "./comment-item.module.scss"

const CommentItem = ({ id, post_id, author_id, author_username, comment_text }: IComment) => {
  return (
    <div className={styles.comment_item}>

      <div className={styles.author_link_block}>
        <Link className={styles.author_link} to={`/user/${author_id}`}>
          {author_username}
          {id}
        </Link>
      </div>

      <span className={styles.comment_text} >{comment_text}</span>

    </div>
  );
};

export default React.memo(CommentItem);