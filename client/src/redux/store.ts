import {combineReducers, configureStore} from "@reduxjs/toolkit";
import postsSlice from "./slices/postsSlice";
import todosSlice  from "./slices/todosSlice";
import  userSlice from './slices/userSlice';


const rootReducer = combineReducers({
    todosReducer: todosSlice,
    userReducer: userSlice,
    postsReducer: postsSlice
})


export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
