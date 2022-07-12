CREATE DATABASE tumblr;

CREATE TABLE user_list (user_id BIGSERIAL PRIMARY KEY, username VARCHAR(15), password VARCHAR(100), user_avatar TEXT DEFAULT null, CONSTRAINT username_unique UNIQUE (username));

INSERT INTO user_list (username, password) VALUES ('qwe', 'qwe');

CREATE TABLE friends (
    id BIGSERIAL PRIMARY KEY,
    friend_one INTEGER NOT NULL,
    friend_two INTEGER NOT NULL,
    status INTEGER DEFAULT 0,
    FOREIGN KEY (friend_one) REFERENCES user_list(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_two) REFERENCES user_list(user_id) ON DELETE CASCADE
    );


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


CREATE TABLE file_to_post (
    post_id BIGSERIAL,
    file_path TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES post_list(post_id) ON DELETE CASCADE
);


CREATE TABLE post_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGSERIAL,
    author_id BIGSERIAL,
    author_username VARCHAR(15), 
    comment_text TEXT,
    FOREIGN KEY (post_id) REFERENCES post_list(post_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES user_list(user_id),
    FOREIGN KEY (author_username) REFERENCES user_list(username)
);

CREATE TABLE like_list (
    user_id BIGINT,
    post_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_list(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post_list(post_id) ON DELETE CASCADE
);


CREATE TABLE message_list (
    id BIGSERIAL PRIMARY KEY,
    sender BIGINT,
    recipient BIGINT,
    message_text TEXT,
    create_time VARCHAR(15),
    FOREIGN KEY (sender) REFERENCES user_list(user_id),
    FOREIGN KEY (recipient) REFERENCES user_list(user_id)
);
