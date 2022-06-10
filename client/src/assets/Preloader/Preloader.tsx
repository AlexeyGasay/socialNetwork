import React from 'react';

import styles from "./preloader.module.scss"

import PreloaderIcon from './PreloaderIcon';

const Preloader = () => {
  return (
    <div className={styles.preloader_container}>

      <div className={styles.preloader}>
        <PreloaderIcon />
      </div>

    </div>
  );
};

export default Preloader;