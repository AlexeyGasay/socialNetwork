create TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255)
);

create TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person(id)
);









---------------------   ТАБМЛЕР

-- ЮЗЕРЫ
create TABLE user_list (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(15) ,
    password VARCHAR(100),
    user_avatar TEXT DEFAULT null,
    CONSTRAINT username_unique UNIQUE (username)
);

INSERT INTO user_list (username, password) VALUES ('qwe', 'qwe');

-- CREATE TABLE avatar_images (
--     user_id BIGSERIAL PRIMARY KEY,
--     file_path TEXT,
--     FOREIGN KEY (user_id) REFERENCES user_list(user_id) ON DELETE CASCADE
-- );      


-- ДРУЗЬЯ
CREATE TABLE friends (
    id BIGSERIAL PRIMARY KEY,
    friend_one INTEGER NOT NULL,
    friend_two INTEGER NOT NULL,
    status INTEGER DEFAULT 0,
    FOREIGN KEY (friend_one) REFERENCES user_list(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_two) REFERENCES user_list(user_id) ON DELETE CASCADE
    );

INSERT INTO friends (friend_one, friend_two) VALUES (1, 4);

-- UPDATE friends 
-- SET status = 1
-- WHERE
-- (friend_one=3 OR friend_two=3)
-- AND
-- (friend_one=1 OR friend_two=1);

UPDATE friends 
SET status = 1
WHERE
friend_one=1 AND friend_two=6;



SELECT * FROM friends WHERE friend_one = 1 AND status = 1 OR friend_two = 1 AND status = 1; 

WITH friend_list AS (
    SELECT * FROM friends WHERE
    friends.friend_one = 1 AND status = 1
    OR
    friends.friend_two = 1 AND status = 1
)
SELECT * FROM friend_list;






-- ПОСТЫ
CREATE TABLE post_list (
    post_id BIGSERIAL PRIMARY KEY,
    author BIGINT NOT NULL,
    author_name VARCHAR(50),
    title_text TEXT NOT NULL,
    text_content TEXT,
    tags TEXT,
    FOREIGN KEY (author) REFERENCES user_list(user_id) ON DELETE CASCADE,
    FOREIGN KEY (author_name) REFERENCES user_list(username)
);

insert into post_list
(author, text_content, title_text)
values
(1, 'qwe', 'qwe');


ALTER TABLE post_list ALTER COLUMN author SET NOT NULL;

ALTER TABLE table_name RENAME TO new_table_name;


-- ФАЙЛЫ ПОСТОВ

CREATE TABLE file_to_post (
    post_id BIGSERIAL,
    file_path TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post_list(post_id) ON DELETE CASCADE
);


-- ЛАЙКИ

CREATE TABLE like_list (
    user_id BIGINT,
    post_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_list(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post_list(post_id) ON DELETE CASCADE
);


-- FULLTEXT SEARCH

CREATE TABLE news (
    id BIGSERIAL,
    title TEXT,
    content TEXT
);
select * from news where to_tsvector(title) || to_tsvector(content) @@ plainto_tsquery('фруктового');


-- MESSAGES

CREATE TABLE message_list (
    id BIGSERIAL PRIMARY KEY,
    sender BIGINT,
    recipient BIGINT,
    message_text TEXT,
    create_time VARCHAR(15),
    FOREIGN KEY (sender) REFERENCES user_list(user_id),
    FOREIGN KEY (recipient) REFERENCES user_list(user_id)
);

INSERT INTO message_list (sender, recipient, message_text, create_time) values (2, 4, 'opoposapod', '12.11');