import React, { useEffect } from 'react';
import ToolsPanel from '../../common/tools/toolsPanel/ToolsPanel';
import PostItem from "../../common/PostItem/PostItem"
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMyPosts } from '../../redux/asyncActions/fetchPosts';

import styles from "./home-page.module.scss";
import Preloader from '../../assets/Preloader/Preloader';


const HomePage = () => {

  const dispatch = useAppDispatch();

  const { user_id } = useAppSelector(state => state.userReducer.user);
  const { myPosts } = useAppSelector(state => state.postsReducer);

  useEffect(() => {
    dispatch(fetchMyPosts(user_id))
  }, [])

  return (
    <div className={styles.home_page}>
      <ToolsPanel />

      {myPosts.length > 0 ?
        myPosts.map((item) => {
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
        <Preloader />
      }

      {
        myPosts.length == 0 ?
          <p className={styles.no_posts}>Вы еще не создали ни одного поста.</p>

          :
          null
      }

    </div>
  );
};

export default HomePage;