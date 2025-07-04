DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id INT NOT NULL PRIMARY KEY,
  role ENUM('USER', 'ADMIN') NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  diet TEXT,
  mail TEXT,
  attendance ENUM('will_join', 'will_not_join', 'undecided')
);

DROP TABLE IF EXISTS user_auth;
CREATE TABLE user_auth (
  id INT NOT NULL PRIMARY KEY,
  password_hash varchar(72) NOT NULL
);

INSERT INTO user_auth(id, password_hash)  VALUES (1, '$2y$12$kjWYp.knjDugDqYCA0IQWe6gDmkr5NNlXWbKVxGbkMkPWDHl8lTLm');
INSERT INTO user(id, role, first_name, last_name) VALUES (1, 'ADMIN', 'ADMIN', 'ADMINIUS');