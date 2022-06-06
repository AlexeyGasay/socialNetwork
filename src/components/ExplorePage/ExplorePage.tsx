import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fetchLikedPostsId, fetchMorePosts, fetchPosts } from '../../redux/asyncActions/fetchPosts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PostItem from '../../common/PostItem/PostItem';
import styles from "./explore-page.module.scss"
import { clearPosts } from '../../redux/slices/postsSlice';


const ExplorePage = () => {

  const dispatch = useAppDispatch();


  const { posts, theEnd } = useAppSelector(state => state.postsReducer);
  const { user_id } = useAppSelector(state => state.userReducer.user);

  const lastPostId = useRef(0);


  const loadMorePosts = () => {

    if (theEnd) {
      return alert("Больше постов нет.")
    }

    dispatch(fetchMorePosts(lastPostId.current))
  }



  useEffect(() => {
    if (user_id) {
      dispatch(fetchLikedPostsId(user_id))
    }
  }, [user_id])

  useEffect(() => {
    dispatch(fetchPosts())
  }, [])


  useEffect(() => {
    return () => {
      dispatch(clearPosts())
    }
  }, [])

  return (
    <div className={styles.explore_page}>

      {posts.length ?
        posts.map((item) => {

          lastPostId.current = +item.post_id;

          return (
            <PostItem
              key={+item.post_id}
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
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio, voluptatibus!</p>

      }

      <button className={styles.load_more} onClick={() => loadMorePosts()}>Загрузить еще постов</button>

    </div>
  );
};

export default ExplorePage;