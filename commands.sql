
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('John Blogger', 'blogsite.a-blog.com', 'My First Blog');
insert into blogs (author, url, title, likes) values ('M. M.', 'blogsite.another-blog.com', 'Another Blog', 1);
insert into blogs (author, url, title) values ('M. M.', 'blogsite.one-more.com', 'A');
