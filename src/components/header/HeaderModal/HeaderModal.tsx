import React, { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logOut } from '../../../redux/slices/userSlice';
import styles from "./header-modal.module.scss"
import "./header-modal.css"
import { Link } from 'react-router-dom';

interface IHeaderModalProps {
  toggle: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  style: string
}

const HeaderModal = ({ isOpen, toggle, style }: IHeaderModalProps) => {

  const dispatch = useAppDispatch();

  const {username} = useAppSelector(state => state.userReducer.user)

  return (
    <div
      className={styles.header__modal_container + " " + style}
      onClick={() => toggle(!isOpen)}
    >

      <div
        className={styles.header__modal}
        onClick={(event) => event.stopPropagation()}
      >

        <div className={styles.header_modal__item}>
          <Link className={styles.modal__link} to="/homePage" >{username}</Link>
        </div>
        <div className={styles.header_modal__item}>
          <Link className={styles.modal__link} to="/likedPostsPage" >Понравилось</Link>
        </div>

        <div className={styles.header_modal__item}>
          <Link className={styles.modal__link} to="/friends">Друзья</Link>
        </div>

        <div className={styles.header_modal__item}>
          <a className={styles.modal__link} href="#" onClick={() => dispatch(logOut())}>Выйти</a>
        </div>

      </div>


    </div>
  );
};

export default HeaderModal;