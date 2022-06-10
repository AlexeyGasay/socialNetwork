import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useDebounce } from '../../redux/hooks';
import Login from '../Login/Login';
import styles from "./header.module.scss"

import logo from "../../assets/images/header/logo.svg"
import HomeIconSvg from '../../assets/images/header/HomeIconSvg';
import ExploreIconSvg from '../../assets/images/header/ExploreIconSvg';
import MailIconSvg from '../../assets/images/header/MailIconSvg';
import ProfileIconSvg from '../../assets/images/header/ProfileIconSvg';
import HeaderModal from './HeaderModal/HeaderModal';
import { dbURL } from '../../assets/config';



const Header = () => {

  const { username, user_id } = useAppSelector(state => state.userReducer.user);

  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);

  const [isOpenHeaderModal, setIsOpenHeaderModal] = useState<boolean>(false);

  const [searchText, setSearchText] = useState('');

  const [searchResult, setSearchResult] = useState<any[]>([]);

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const [isVisibleHeaderNav, setIsVisibleHeaderNav] = useState<boolean>(false);



  const searchPeople = async () => {

    await fetch(`${dbURL}/api/searchPeople?username=${searchText.slice(1)}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        setSearchResult(data)
      });
  }

  // const searchPosts = async () => {

  //   await fetch(`${dbURL}/api/searchPosts?post_title=${searchText}`, {
  //     method: "GET",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       setSearchResult(data)
  //     });
  // }

  const onBlurHandler = () => {
    setTimeout(() => {
      setSearchResult([]);
      setSearchText('');
    }, 300)
  }


  useEffect(() => {
    setIsOpenLogin(false)
  }, [username]);


  // ОТЛОЖЕННЫЙ ПОИСК
  useEffect(() => {
    if (debouncedSearchTerm) {

      // Первый символ поисковой строки
      let firstSearchLetter = debouncedSearchTerm.trim()[0];

      if (firstSearchLetter == "@") {
        searchPeople()
      }

    }
  }, [debouncedSearchTerm]);



  const userNavClasses = [styles.user_nav, isVisibleHeaderNav ? styles.visible : styles.hidden].join(" ");
  const burgerClasses = [styles.header_burger, isVisibleHeaderNav ? styles.hidden : styles.visible].join(" ");


  return (
    <div className={styles.header_nav}>
      <div className={styles.header_inner}>

        <div className={styles.search_box}>

          <div className={styles.logo_box}>
            <Link to="/explore">
              <img className={styles.logo} src={logo} alt="logo" />
            </Link>
          </div>

          <input
            className={styles.search_input}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onBlur={() => onBlurHandler()}
            type="text"
            placeholder={"Поиск по сайту"}
          />


          {searchResult.length > 0 ?

            <div className={styles.search_result}>

              {
                searchResult.map(el => {
                  return (
                    <Link key={el.user_id} className={styles.found_people} to={`/user/${el.user_id}`}>{el.username}</Link>
                  )
                })
              }

            </div>

            :

            null
          }

        </div>


        {/* Если залогинен, показать меню */}
        {username ?

          <div className={styles.nav_container}>

            <ul
              className={userNavClasses}
            >

              <svg onClick={() => setIsVisibleHeaderNav(false)} className={styles.close_btn} width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.906 35.4818L70.2635 9.12604C71.1992 8.1901 71.1992 6.67554 70.2635 5.73991L65.2262 0.700759C64.7775 0.252427 64.1687 0 63.5333 0C62.8976 0 62.2888 0.252427 61.8402 0.700759L35.4827 27.0585L9.12523 0.700759C8.67659 0.252427 8.06778 0 7.43217 0C6.79671 0 6.18774 0.252427 5.73926 0.700759L0.701953 5.73991C-0.233984 6.67554 -0.233984 8.1901 0.701953 9.12604L27.0594 35.482L0.704571 61.8347C-0.230904 62.7706 -0.230904 64.2852 0.704571 65.2208L5.74218 70.2599C6.19051 70.7083 6.79948 70.9607 7.43509 70.9607C8.0707 70.9607 8.67952 70.7083 9.12831 70.2599L35.4826 43.9052L61.8369 70.2599C62.2856 70.7083 62.8944 70.9607 63.53 70.9607C64.1658 70.9607 64.7746 70.7083 65.2229 70.2599L70.2605 65.2208C71.196 64.2852 71.196 62.7706 70.2605 61.8347L43.906 35.4818Z" fill="white" />
              </svg>

              <li>
                <Link className={[styles.home, styles.user_nav__link].join(" ")} to="/">
                  <HomeIconSvg />
                </Link>
              </li>


              <li className={styles.user_nav__link}>
                <Link to="/explore">
                  <ExploreIconSvg />
                </Link>
              </li>

              <li className={styles.user_nav__link}>
                <Link to="/contacts">
                  <MailIconSvg />
                </Link>
              </li>

              <li>
                <Link
                  className={styles.user_nav__link} to="#"
                  onClick={() => setIsOpenHeaderModal(!isOpenHeaderModal)}
                >
                  <ProfileIconSvg />
                </Link>
              </li>

            </ul>

            <button
              className={burgerClasses}
              onClick={() => setIsVisibleHeaderNav(!isVisibleHeaderNav)}>
              <svg className={styles.header_burger_svg} width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.6 23.2C9.46452 23.2 7.73334 24.9312 7.73334 27.0667C7.73334 29.2022 9.46452 30.9333 11.6 30.9333H104.4C106.535 30.9333 108.267 29.2022 108.267 27.0667C108.267 24.9312 106.535 23.2 104.4 23.2H11.6ZM7.73334 58C7.73334 55.8645 9.46452 54.1333 11.6 54.1333H104.4C106.535 54.1333 108.267 55.8645 108.267 58C108.267 60.1355 106.535 61.8666 104.4 61.8666H11.6C9.46452 61.8666 7.73334 60.1355 7.73334 58ZM7.73334 88.9333C7.73334 86.7981 9.46452 85.0666 11.6 85.0666H104.4C106.535 85.0666 108.267 86.7981 108.267 88.9333C108.267 91.0685 106.535 92.7999 104.4 92.7999H11.6C9.46452 92.7999 7.73334 91.0685 7.73334 88.9333Z" fill="#FFFCFC" />
              </svg>
            </button>

          </div>

          :

          <div className={styles.header_login} onClick={() => setIsOpenLogin(!isOpenLogin)}>
            Войти
          </div>



        }

      </div>

      <Login
        isOpen={isOpenLogin}
        toggle={setIsOpenLogin}
        style={isOpenLogin ? "visible_modal" : "hidden_modal"}
      />


      <HeaderModal
        isOpen={isOpenHeaderModal}
        style={isOpenHeaderModal ? "visable" : "hidden"}
        toggle={setIsOpenHeaderModal}
      />

    </div>
  );
};

export default Header;