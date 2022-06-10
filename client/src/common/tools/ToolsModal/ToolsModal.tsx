import React, { useState } from 'react';
import styles from "./tools-modal.module.scss"
import photoTool from "../../../assets/images/Tools/photoTool.png"
import videoTool from "../../../assets/images/Tools/videoTool.png"
import audioTool from "../../../assets/images/Tools/audioTool.png"
import { useAppSelector } from '../../../redux/hooks';
import { dbURL } from '../../../assets/config';




const ToolsModal = (props: any) => {

  const { user_id, token, username} = useAppSelector(state => state.userReducer.user);

  const [post, setPost] = useState({
    author: user_id,
    username: username,
    header_text: "",
    body_text: "",
    tags: "",
  });

  const [file, setFile] = useState<File[]>([])

  const postHandler = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {

    const targetName = e.target.name;
    let value = e.target.value;

    switch (targetName) {
      case "header_text_input": {
        setPost({
          author: post.author,
          username: post.username,
          header_text: value,
          body_text: post.body_text,
          tags: post.tags,
        })
        break
      }

      case "text_area_input": {
        setPost({
          author: post.author,
          username: post.username,
          body_text: value,
          header_text: post.header_text,
          tags: post.tags,
        })
        break
      }

      case "tags_input": {
        setPost({
          author: post.author,
          username: post.username,
          tags: value,
          header_text: post.header_text,
          body_text: post.body_text,
        })
        break
      }

    }
  }

  const postValidate = (): boolean => {
    if (file.length > 0) return true;
    else if (
      post.header_text.length < 5 ||
      post.body_text.length < 5
    ) {
      return false;
    }
    else return true;
  }


  const handleFilesChange = ({
    currentTarget: { files }
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files?.length) {
      if (file.length + files.length > 5) {
        return alert("Не более 5 файлов")
      }
    }
    // debugger
    if (files && files.length) {
      setFile(existing => existing.concat(Array.from(files))); // *** Only change is here
    }

  }

  

  const deleteFile = (fileIndex: number) => {
    let newState = file.filter((item, index) => index != fileIndex)

    setFile(newState)
  }

  const createPost = async (e: React.MouseEvent<HTMLButtonElement>) => {

    let valide = postValidate();

    if (!valide) {
      return alert("Пост слишком пустой")
    }

    let body = {
      author: post.author,
      username: post.username,
      title_text: post.header_text,
      text_content: post.body_text,
      tags: post.tags
    }

    try {

      // Вначале создается пост
      const newPost = await fetch(`${dbURL}/api/post`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,

        }
      })
        .then(res => res.json())


      console.log(newPost);



      // -------------------------------------------------------------
      // Далее собираются и отправляются файлы
      e.preventDefault();
      if (!file) return;

      const data = new FormData();

      // Перебор массива файлов и добавление их к файлу отправки
      file.map((itemFile) => {
        data.append("name", Date.now().toString());
        data.append("file", itemFile);
      })

      // data.append('post_id', newPost.data.post.post_id);
      data.append('post_id', newPost.post.post_id);

      await fetch(`${dbURL}/api/uploadPostFiles`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(res => res.json())
        .then(() => alert("Пост создан"))

      setPost({
        author: post.author,
        username: post.username,
        header_text: "",
        body_text: "",
        tags: "",
      });
      setFile([]);



    } catch (e) {
      console.log(e);

    }

  }


  return (
    <div
      className={styles.tools_modal}
      onClick={() => props.toggle()}
    >
      <div onClick={(event) => event.stopPropagation()} className={styles.tools_inner}>

        <div className={styles.header_text_area}>
          <input
            className={styles.header_text_input}
            name="header_text_input"
            type="text"
            placeholder='Заголовок'
            value={post.header_text}
            onChange={(e) => postHandler(e)}
          />
        </div>

        <div className={styles.body_text_area}>

          <textarea
            className={styles.text_area_input}
            name="text_area_input"
            placeholder='Введите текст'
            cols={30}
            rows={10}
            value={post.body_text}
            onChange={(e) => postHandler(e)}
          >
          </textarea>

        </div>

        <div className={styles.tools_container}>
          <label htmlFor="files_input">

            <img className={styles.tool} src={photoTool} alt="photoTool" />

          </label>

          <img className={styles.tool} src={videoTool} alt="videoTool" />
          <img className={styles.tool} src={audioTool} alt="audioTool" />
        </div>

        <input
          className={styles.tags_input}
          onChange={(e) => postHandler(e)}
          value={post.tags}
          placeholder="#теги"
          name="tags_input"
          type="text"
        />

        <div className={styles.publish_container}>
          <button onClick={() => props.toggle()} className={styles.closeBtn}>Закрыть</button>
          <button onClick={(e) => createPost(e)} disabled={false} className={styles.publishBtn}>Опубликовать</button>
        </div>


        <form style={{ color: '#fff' }}>
          <label>Файл</label> <br />

          <input
            id='files_input'
            className={styles.files_input}
            onChange={(e) => handleFilesChange(e)}
            type="file"
            name="filedata" multiple /><br />

        </form>


        {file.map((item, index) => {
          console.log(item);

          return (
              <p key={item.name + index}>
                {item.name}
                <button onClick={() => deleteFile(index)} className={styles.delete_file}>X</button>
              </p>
          )
        })}

      </div>
    </div>
  );
};

export default ToolsModal;