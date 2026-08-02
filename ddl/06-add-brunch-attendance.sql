ALTER TABLE family_member
  ADD COLUMN brunch_attendance ENUM('will_join', 'will_not_join', 'undecided') DEFAULT NULL;

UPDATE family_member
  SET brunch_attendance = 'will_not_join'
  WHERE attendance = 'will_not_join';
