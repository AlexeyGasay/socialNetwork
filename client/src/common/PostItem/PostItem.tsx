import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFriendRequest } from '../../redux/asyncActions/fetchFriends';
import { fetchLikedPostsId } from '../../redux/asyncActions/fetchPosts';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { IPost } from '../../redux/slices/postsSlice';

import commentIcon from "../../assets/images/Posts/commentIcon.png"

import styles from "./post-item.module.scss"
import CommentsBlock from '../CommentsBlock/CommentsBlock';
import { dbURL } from '../../assets/config';


const PostItem = (
  { author,
    author_name,
    post_id,
    title_text,
    text_content,
    tags }: IPost) => {

  interface IFile {
    post_id: string,
    file_path: string
  }

  type IFileState = {
    images: IFile[],
    videos: IFile[],
    audio: IFile[]
  }

  const [files, setFiles] = useState<IFileState>({
    images: [],
    videos: [],
    audio: [],
  })

  const dispatch = useAppDispatch();

  const [liked, setLiked] = useState<boolean>(false);

  const [likesCount, setLikesCount] = useState<number>(0);


  const { likedPostsId } = useAppSelector(state => state.postsReducer);
  const { user_id } = useAppSelector(state => state.userReducer.user);

  const [isOpenComment, setIsOpenComment] = useState<boolean>(false)

  const checkLike = () => {

    for (let i = 0; i < likedPostsId.length; i++) {
      // debugger
      const element = likedPostsId[i];
      if (+post_id == +element.post_id) {
        setLiked(true);
        break;
      }

    }

  }


  const fileFilter = (files: any[]) => {

    let newFilesState: IFileState = {
      images: [],
      videos: [],
      audio: []
    }

    let videoPattern = ["mp4"];

    let audioPattern = ["mp3"];

    let imgPattern = ["jpg", "jpeg", "png"];

    files.map(file => {
      let type = file.file_path.split(".")[1];

      if (imgPattern.includes(type)) {
        newFilesState.images.push(file)
      }

      else if (videoPattern.includes(type)) {
        newFilesState.videos.push(file)
      }

      else if (audioPattern.includes(type)) {
        newFilesState.audio.push(file)
      }

    })

    setFiles(newFilesState)

  }

  const likePost = async () => {
    if (!user_id) {
      return alert("Войдите в профиль");
    }

    await fetch(`${dbURL}/api/likePost?user_id=${user_id}&post_id=${post_id}`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .then(() => setLiked(true))
  }

  const dislikePost = async () => {
    // debugger
    if (!user_id) {
      return alert("Войдите в профиль");
    }

    await fetch(`${dbURL}/api/dislikePost?user_id=${user_id}&post_id=${post_id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .then(() => setLiked(false));
  }

  const getLikesPost = async () => {
    const likesCount = await fetch(`${dbURL}/api/postLikes?post_id=${post_id}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => data);

    setLikesCount(likesCount);

  }


  const sendFriendRequest = () => {

    if (!user_id) {
      return alert("Войдите в профиль.")
    }

    let body = {
      sender: user_id,
      recipient: author
    }

    let isSure;

    isSure = window.confirm("Вы хотите отпрвить запрос дружбы ?");

    if (isSure == true) {
      fetchFriendRequest(body);
    }

  }


  // КОЛИЧЕСТВО ЛАЙКОВ
  useEffect(() => {
    getLikesPost()
  }, [liked])

  // ЛАЙКНУТЫЕ ПОСТЫ
  useEffect(() => {
    if (user_id) {
      dispatch(fetchLikedPostsId(user_id))
    }
  }, [likesCount])

  // ПРОВЕРКА ЛАЙКНУТ ЛИ ПОСТ
  useEffect(() => {
    checkLike()
  }, [likedPostsId])


  // ПОДГРУЗКА ФАЙЛОВ
  useEffect(() => {

    try {
      fetch(`${dbURL}/api/postFiles?post_id=${post_id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => fileFilter(data))

        .catch(res => console.log(res))

    } catch (e) {
      console.log(e);

    }

  }, [])


  return (
    <div className={styles.news_item}>

      <div className={styles.news_item__header_block}>

        <div className={styles.author_block}>
          <h3>
            <Link className={styles.author} to={`/user/${author}`} >
              {author_name}
            </Link>
          </h3>
          <a href='#' className={styles.read} onClick={() => sendFriendRequest()}>Читать</a>

        </div>

        <div className={styles.options}>
          <button className={styles.options__btn}>...</button>
        </div>


      </div>

      <div className={styles.news_item__content_block}>

        <div className={styles.text_block}>

          {/* TITLE */}
          {title_text ? <h3>{title_text}</h3> : null}

          {/* TEXT */}
          {text_content ? <p>{title_text}</p> : null}

        </div>

        {/* IMAGES */}
        {files.images.length > 0 ?

          <div className={styles.img_block}>

            {files.images.map(file => {
              return (
                <img
                  key={file.file_path}
                  className={[styles.img, styles.file].join(" ")}
                  src={`${dbURL}/static/` + file.file_path}
                  alt="img"
                />
              )
            })

            }
          </div>
          :
          null
        }

        {/* VIDEOS */}
        {files.videos.length > 0 ?

          <div className={styles.video_block}>

            {files.videos.map(file => {

              return (
                <video
                  key={file.file_path}
                  className={[styles.video, styles.file].join(" ")}
                  controls
                  src={`${dbURL}/static/` + file.file_path}
                />
              )

            })

            }
          </div>
          :
          null
        }

        {/* AUDIO */}
        {files.audio.length > 0 ?

          <div className={styles.audio_block}>

            {files.audio.map(file => {

              return (
                <audio
                  key={file.file_path}
                  className={[styles.audio, styles.file].join(" ")}
                  controls
                  src={`${dbURL}/static/` + file.file_path}
                />
              )

            })

            }
          </div>
          :
          null
        }


        {/* TAGS */}
        {tags ?

          <p>
            {tags.split("#").map(tag => {

              if (tag.length > 1) {
                return (
                  <a key={tag + Date.now()} href={`#${tag}`}>{"#" + tag}</a>)
              }
            }

            )}

          </p>

          :
          null
        }

      </div>


      <div className={styles.news_item__share_box}>
        <button className={styles.share_btn}>
          {/* share */}
        </button>

        <button className={styles.open_comment_btn} onClick={() => setIsOpenComment(!isOpenComment)}>
          <img src={commentIcon} alt="commentIcon" />
        </button>

        <button
          className={styles.like_btn}
          onClick={liked ? dislikePost : likePost}
        >
          <span className={styles.like_count}>
            {likesCount}
          </span>
          <svg role="img" width="23" height="21" viewBox="0 0 20 18">
            <path className={liked ? styles.likedPost : styles.notLikedPost} d="M14.658 0c-1.625 0-3.21.767-4.463 2.156-.06.064-.127.138-.197.225-.074-.085-.137-.159-.196-.225C8.547.766 6.966 0 5.35 0 4.215 0 3.114.387 2.162 1.117c-2.773 2.13-2.611 5.89-1.017 8.5 2.158 3.535 6.556 7.18 7.416 7.875A2.3 2.3 0 0 0 9.998 18c.519 0 1.028-.18 1.436-.508.859-.695 5.257-4.34 7.416-7.875 1.595-2.616 1.765-6.376-1-8.5C16.895.387 15.792 0 14.657 0h.001zm0 2.124c.645 0 1.298.208 1.916.683 1.903 1.461 1.457 4.099.484 5.695-1.973 3.23-6.16 6.7-6.94 7.331a.191.191 0 0 1-.241 0c-.779-.631-4.966-4.101-6.94-7.332-.972-1.595-1.4-4.233.5-5.694.619-.475 1.27-.683 1.911-.683 1.064 0 2.095.574 2.898 1.461.495.549 1.658 2.082 1.753 2.203.095-.12 1.259-1.654 1.752-2.203.8-.887 1.842-1.461 2.908-1.461h-.001z">
            </path>
          </svg>
        </button>

      </div>

      {
        isOpenComment
          ?
          <CommentsBlock user_id={user_id} post_id={post_id} />
          :
          null
      }

    </div >
  );
};

export default React.memo(PostItem);