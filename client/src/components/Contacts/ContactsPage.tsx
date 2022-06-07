import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../../assets/Preloader/Preloader';
import { fetchContacts } from '../../redux/asyncActions/fetchMessages';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';


import styles from "./contacts-page.module.scss"

const ContactsPage = () => {

  const dispatch = useAppDispatch();


  const { user_id } = useAppSelector(state => state.userReducer.user)
  const { contacts } = useAppSelector(state => state.userReducer)



  useEffect(() => {
    dispatch(fetchContacts(user_id))
  }, [])


  return (
    <div className={styles.contacts_page}>

      {contacts.length > 0 ? contacts.map((contact) => {
        return (
          <div key={contact.user_id} className={styles.contact}>
            <Link className={styles.username} to={`/dialog/${contact.user_id}`}>
              {contact.username}
            </Link>
          </div>
        )
      })
        :
        <Preloader />
      }



    </div>
  );
};

export default ContactsPage;