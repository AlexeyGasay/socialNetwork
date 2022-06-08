import React, { useState } from 'react';
import styles from "./tools-panel.module.scss"

import textTool from "../../../assets/images/Tools/textTool.png"
import videoTool from "../../../assets/images/Tools/videoTool.png"
import audioTool from "../../../assets/images/Tools/audioTool.png"
import photoTool from "../../../assets/images/Tools/photoTool.png"
import ToolsModal from '../ToolsModal/ToolsModal';
import { useAppSelector } from '../../../redux/hooks';

const ToolsPanel = () => {

  const { user_id } = useAppSelector(state => state.userReducer.user)

  const [modalVis, setModalVis] = useState(false);

  const modalHandler = () => {
    if (!user_id) {
      return alert("Войдите в учетную запись");
    }
    setModalVis(!modalVis);
  }

  return (
    <>
      {modalVis ? <ToolsModal toggle={modalHandler} /> : null}


      <ul className={styles.tools_panel}>
        <li
          className={styles.tools_pane__item}
          onClick={() => modalHandler()}
        >
          <img src={textTool} alt="textTool" />
          <p>Текст</p>
        </li>
        <li
          className={styles.tools_pane__item}
          onClick={() => modalHandler()}
        >
          <img src={photoTool} alt="textTool" />
          <p>Фото</p>
        </li>
        <li
          className={styles.tools_pane__item}
          onClick={() => modalHandler()}
        >
          <img src={videoTool} alt="textTool" />
          <p>Видео</p>
        </li>
        <li
          className={styles.tools_pane__item}
          onClick={() => modalHandler()}
        >
          <img src={audioTool} alt="textTool" />
          <p>Аудио</p>
        </li>
      </ul>
    </>
  );
};

export default ToolsPanel;