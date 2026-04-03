ALTER TABLE family_member ADD COLUMN type ENUM('adult', 'child', 'infant');

UPDATE family_member SET type = CASE WHEN child = 1 THEN 'child' ELSE 'adult' END;

ALTER TABLE family_member MODIFY COLUMN type ENUM('adult', 'child', 'infant') NOT NULL;

ALTER TABLE family_member DROP COLUMN child;
