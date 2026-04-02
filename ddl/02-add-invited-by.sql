ALTER TABLE user ADD COLUMN invited_by ENUM('groom', 'bride', 'both');
UPDATE user SET invited_by = 'both';
ALTER TABLE user MODIFY COLUMN invited_by ENUM('groom', 'bride', 'both') NOT NULL;
