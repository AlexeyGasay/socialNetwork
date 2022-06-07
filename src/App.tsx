import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import styles from "./app-styles.module.scss"
import Header from './components/header/Header';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './hoc/PrivateRoute';
import HomePage from './components/HomePage/HomePage';
import ExplorePage from './components/ExplorePage/ExplorePage';
import UserPage from './components/UserPage/UserPage';
import FrindsPage from './components/FriendsPage/FrindsPage';
import { fetchFriendsAndRequests } from './redux/asyncActions/fetchFriends';
import ContactsPage from './components/Contacts/ContactsPage';
import Dialog from './components/Dialog/Dialog';
import LikedPostsPage from './components/LikedPostsPage/LikedPostsPage';
import CommentsBlock from './common/CommentsBlock/CommentsBlock';





function App() {

  const { token, user_id } = useAppSelector(state => state.userReducer.user);
  const dispatch = useAppDispatch();




  useEffect(() => {
    if (user_id != null)
      dispatch(fetchFriendsAndRequests(user_id))
  }, [user_id])

  return (
    <div className={styles.App}>
      <div className={styles.wrapper}>
        <Header />


        <Routes>

          <Route
            path='/'
            element={
              <PrivateRoute>
                {/* <CommentItem /> */}
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route path='/explore' element={<ExplorePage />} />

          <Route path='/friends' element={<FrindsPage />} />

          <Route
            path='/contacts'
            element={
              <PrivateRoute>
                <ContactsPage />
              </PrivateRoute>
            }
          />

          <Route
            path='/dialog/:contact_id'
            element={
              <PrivateRoute>
                <Dialog />
              </PrivateRoute>
            }
          />


          <Route
            path='/likedPostsPage'
            element={
              <PrivateRoute>
                <LikedPostsPage />
              </PrivateRoute>
            }
          />




          <Route path='/user/:user_id_param' element={<UserPage />} />

        </Routes>


      </div>
    </div>
  );
}

export default App;
