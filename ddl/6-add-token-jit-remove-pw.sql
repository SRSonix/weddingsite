ALTER TABLE user_auth DROP COLUMN password_hash; 

ALTER TABLE user_auth ADD COLUMN jti VARCHAR(64);