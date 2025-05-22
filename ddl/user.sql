DROP TABLE user;
CREATE TABLE user (
  id INT NOT NULL PRIMARY KEY,
  password_hash varchar(72) NOT NULL,
  role ENUM('USER', 'ADMIN') NOT NULL,
  name varchar(265) NOT NULL
);