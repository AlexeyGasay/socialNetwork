import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  user_id: string | null;
  username: string;
  password: string;
  friends_count: number;
  token?: string | null;
}

export interface IFriendOrRequest {
  user_id: string;
  username: string;
}

export interface IMessage {
  id: string;
  sender: string;
  recipient: string;
  message_text: string;
  create_time: string;
}

interface ILoggedUserData {
  token: string;
  user: IUser;
}

interface IState {
  user: IUser;

  theEnd: boolean;
  messages: IMessage[],
  contacts: IFriendOrRequest[],

  friends: IFriendOrRequest[],
  userFriendRequests: IFriendOrRequest[],
  toUserFriendRequests: IFriendOrRequest[],
}



const initialState: IState = {
  user: {
    user_id: null,
    username: "",
    password: "",
    friends_count: 0,
    token: null
  },


  // MESSAGES

  theEnd: false,

  messages: [],

  contacts: [],

  // FRIENDS
  friends: [],

  userFriendRequests: [],

  toUserFriendRequests: [],
}

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {

    login(state, action: PayloadAction<ILoggedUserData>) {

      state.user.user_id = action.payload.user.user_id;
      state.user.username = action.payload.user.username;
      state.user.password = action.payload.user.password;
      state.user.friends_count = action.payload.user.friends_count;
      state.user.token = action.payload.token;

      localStorage.setItem("user_id", state.user.user_id != null ? state.user.user_id : "");
    },

    logOut(state) {
      state.user.user_id = "";
      state.user.username = "";
      state.user.password = "";
      state.user.friends_count = 0;
      state.user.token = "";

      localStorage.removeItem("user_id");
    },

    // MESSAGES

    setContacts(state, action) {
      state.contacts = action.payload;
    },

    setMessages(state, action) {
      if (action.payload.data.length > 0) {

        state.messages = [...action.payload.data, ...state.messages];
        state.theEnd = action.payload.theEnd;
      }

      else state.theEnd = true

    },

    setLastMessages(state, action) {

      let lastExistMsgId: number = +state.messages[state.messages.length - 1].id;
      let lastNewMesgId: number = +action.payload[action.payload.length - 1].id;

      if (lastExistMsgId != lastNewMesgId) {

        let fetchedMessages: IMessage[] = action.payload;

        let stateMessages = [...state.messages];

        for (let i = 0; i < stateMessages.length; i++) {
          const msgId = stateMessages[i].id;

          fetchedMessages = fetchedMessages.filter(el => +el.id != +msgId)
        }

        state.messages = state.messages.concat(fetchedMessages);

      }

    },

    clearMessages(state) {
      state.messages = [];
    },


    // FRIENDS
    setFriends(state, action) {
      state.friends = action.payload;
    },

    setUserFriendRequests(state, action) {
      state.userFriendRequests = action.payload;
    },

    setToUserFriendRequests(state, action) {
      state.toUserFriendRequests = action.payload;
    },
  }
})


export default userSlice.reducer;

export const {
  login, logOut,
  setContacts, setMessages, setLastMessages, clearMessages,
  setFriends, setUserFriendRequests, setToUserFriendRequests } = userSlice.actions;