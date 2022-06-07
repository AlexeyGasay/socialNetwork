import React, { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { fetchLogin, fetchRegistration, ILoginData } from '../../redux/asyncActions/loginAndReg';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import styles from "./login.module.scss"
import "./login.css"


interface IloginProps {
  toggle: Dispatch<SetStateAction<boolean>>;
  style: string;
  isOpen: boolean;
}

const Login = ({toggle, style, isOpen}: IloginProps) => {

  const dispatch = useAppDispatch();

  const [logOrReg, setLogOrReg] = useState<boolean>(true);
  const [validated, setValidated] = useState<boolean>(false);

  const [userData, setUserData] = useState<ILoginData>({
    username: "",
    password: ""
  });

  const validator = () => {
    if ( userData.username.length >= 3 && userData.password.length >= 3 ) {
      setValidated(true)
    } else {
      setValidated(false)
    }
  }

  const loginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

    let inputValue = e.target.value;

    switch (e.target.name) {
      case "username": {
        setUserData({
          username: inputValue,
          password: userData.password
        });
        break
      }

      case "password": {
        setUserData({
          username: userData.username,
          password: inputValue
        });
        break
      }
    }


  }



  const login = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchLogin(userData));
    setUserData({ username: "", password: "" })

  }
  const registration = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchRegistration(userData)
  }

  useEffect(() => {
    validator();
  }, [userData.username, userData.password])


  return (
    <div
      onClick={() => toggle(!isOpen)}
      className={styles.login_container + " " + style}
    >



      <form
        className={styles.login_form}
        onClick={(e) => e.stopPropagation()}
      >

        {!validated && <h2 className={styles.warning}>Не менее 3-х символов в логине и пароле {"исп только английский"}</h2>}

        <input
          onBlur={() => validator()}
          value={userData.username}
          className={styles.login_input}
          onChange={(e) => loginHandler(e)}
          type="text"
          placeholder='username'
          name='username'
        />

        <input
          onBlur={() => validator()}
          className={styles.login_input}
          value={userData.password}
          onChange={(e) => loginHandler(e)}
          type="text"
          placeholder='password'
          name='password'
        />
        {logOrReg ?
          <button
            disabled={!validated}
            className={styles.login_btn}
            onClick={(e) => login(e)}>Войти
          </button>
          :
          <button
            disabled={!validated}
            className={styles.login_btn}
            onClick={(e) => registration(e)}>Регистрация
          </button>
        }

        {logOrReg ?
          <p>Еще не <span className={styles.accent} onClick={() => setLogOrReg(!logOrReg)}>зарегистрированы?</span></p>
          :
          <p>Войти в уже существующую <span className={styles.accent} onClick={() => setLogOrReg(!logOrReg)}>учетную запись</span></p>
        }

      </form>

    </div>
  );
};

export default Login;