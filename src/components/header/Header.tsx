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

  const { username } = useAppSelector(state => state.userReducer.user);

  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);

  const [isOpenHeaderModal, setIsOpenHeaderModal] = useState<boolean>(false);

  const [searchText, setSearchText] = useState('');

  const [searchResult, setSearchResult] = useState<any[]>([]);

  const debouncedSearchTerm = useDebounce(searchText, 500);


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

          <ul className={styles.user_nav}>

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