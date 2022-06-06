
import { dbURL } from "../../assets/config";
import { setLikedPosts, setPosts, setUserPosts, setMyPosts, setLikedPostsId } from "../slices/postsSlice";
import { AppDispatch } from "../store";


export const fetchPosts = () => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/postsAll`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      dispatch(setPosts(json))
    })

}


export const fetchMorePosts = (lastPostId: string | number) => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/loadMorePosts?lasPostId=${lastPostId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      dispatch(setPosts(data))
    })

}

export const fetchLikedPostsId = (user_id: string | null) => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/postsLikedId?user_id=${user_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      dispatch(setLikedPostsId(data))
    })

}

export const fetchLikedPosts = (user_id: string | null) => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/postsLiked?user_id=${user_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      dispatch(setLikedPosts(data))
    })

}

export const fetchMyPosts = (user_id: string | null) => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/userPosts?user_id=${user_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      dispatch(setMyPosts(data))
    })

}
export const fetchUserPosts = (user_id: string | null) => async (dispatch: AppDispatch) => {
  fetch(`${dbURL}/api/userPosts?user_id=${user_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      dispatch(setUserPosts(data))
    })

}