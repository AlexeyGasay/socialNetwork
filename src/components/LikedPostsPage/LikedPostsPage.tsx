import React, { useEffect } from 'react';
import PostItem from '../../common/PostItem/PostItem';
import { fetchLikedPosts, fetchLikedPostsId } from '../../redux/asyncActions/fetchPosts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearLikedPosts } from '../../redux/slices/postsSlice';

import styles from "./liked-posts-page.module.scss"

const LikedPostsPage = () => {

  const dispatch = useAppDispatch();

  const { user_id } = useAppSelector(state => state.userReducer.user)
  const { likedPosts } = useAppSelector(state => state.postsReducer)



  useEffect(() => {
    if (user_id) {
      dispatch(fetchLikedPostsId(user_id))
    }
  }, [user_id])


  useEffect(() => {
    dispatch(fetchLikedPosts(user_id))
  }, [])


  useEffect(() => {

    return () => {
      dispatch(clearLikedPosts())
    }

  }, [])

  return (
    <div>

      {likedPosts.length ?
        likedPosts.map((item) => {

          // lastPostId.current = +item.post_id;

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
    </div>
  );
};

export default LikedPostsPage;