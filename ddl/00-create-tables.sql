CREATE TABLE user (
  id INT NOT NULL PRIMARY KEY,
  role ENUM('USER', 'ADMIN') NOT NULL,
  name TEXT,
  mail TEXT,
  attendance ENUM('will_join', 'will_not_join', 'undecided'),
  language ENUM('fr', 'de'),
  last_visit TIMESTAMP,
  seating_preference TEXT
);

CREATE TABLE user_auth (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  jti VARCHAR(64)
);

CREATE TABLE family_member (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name TEXT,
  diet TEXT,
  child BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES user(id)
);