import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPost {
  author: string,
  author_name: string,
  post_id: string,
  tags: string,
  text_content: string,
  title_text: string
}

interface ILikedPostsId {
  post_id: string;
}

interface IState {
  posts: IPost[],
  theEnd: boolean;
  likedPostsId: ILikedPostsId[],
  likedPosts: IPost[],
  userPosts: IPost[],
  myPosts: IPost[]
}

const initialState: IState = {
  posts: [],
  theEnd: false,
  likedPostsId: [],
  likedPosts: [],
  userPosts: [],
  myPosts: []
}



const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {

    setPosts(state, action) {

      if (action.payload.data.length == 0) {
        state.theEnd = true;
      }
      let statePosts = [...state.posts];

      let newState = [...statePosts, ...action.payload.data]

      state.posts = newState
    },

    clearPosts(state) {
      state.posts = []
    },

    setLikedPostsId(state, action: PayloadAction<ILikedPostsId[]>) {
      state.likedPostsId = action.payload;
    },

    setLikedPosts(state, action: PayloadAction<IPost[]>) {
      state.likedPosts = action.payload;
    },

    clearLikedPosts(state) {
      state.likedPosts = []
    },

    setMyPosts(state, action: PayloadAction<IPost[]>) {
      state.myPosts = action.payload;
    },

    setUserPosts(state, action: PayloadAction<IPost[]>) {
      state.userPosts = action.payload;
    },


  }
})


export default postsSlice.reducer;
export const {
  setPosts, clearPosts,
  setLikedPostsId, setLikedPosts, clearLikedPosts,
  setUserPosts, setMyPosts
} = postsSlice.actions;