ALTER TABLE user
ADD COLUMN language ENUM('en', 'es', 'de'),
ADD COLUMN arrival_date DATE,
ADD COLUMN departure_date DATE;

CREATE TABLE guest(
  user_id INT NOT NULL,
  id INT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  diet TEXT,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

ALTER TABLE guest ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user(id);