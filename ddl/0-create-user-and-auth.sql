CREATE TABLE user (
  id INT NOT NULL PRIMARY KEY,
  role ENUM('USER', 'ADMIN') NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  diet TEXT,
  mail TEXT,
  attendance ENUM('will_join', 'will_not_join', 'undecided')
);

CREATE TABLE user_auth (
  id INT NOT NULL PRIMARY KEY,
  password_hash varchar(72) NOT NULL
);