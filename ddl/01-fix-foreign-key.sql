ALTER TABLE family_member DROP FOREIGN KEY family_member_ibfk_1;

ALTER TABLE family_member
  ADD CONSTRAINT family_member_ibfk_1
  FOREIGN KEY (user_id) REFERENCES user(id)
  ON DELETE CASCADE;