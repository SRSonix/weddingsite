-- Add attendance to family_member, initialized from the owning user's value
ALTER TABLE family_member
  ADD COLUMN attendance ENUM('will_join', 'will_not_join', 'undecided') DEFAULT NULL;

UPDATE family_member fm
  JOIN user u ON fm.user_id = u.id
  SET fm.attendance = u.attendance;

-- Remove columns no longer needed on user
ALTER TABLE user
  DROP COLUMN attendance,
  DROP COLUMN seating_preference;
