SELECT * FROM user;
--DROP TABLE user;
DELETE FROM user;

INSERT INTO user (id, name, balance ) VALUES ('1','a','10');
INSERT INTO user (id, name, balance ) VALUES ('2','b','20');
INSERT INTO user (id, name, balance ) VALUES ('3','c','30');
INSERT INTO user (id, name, balance ) VALUES ('4','d','40');
INSERT INTO user (id, name, balance ) VALUES ('5','e','50');

BEGIN TRANSACTION;
	INSERT INTO user (id, name, balance ) VALUES ('6','f','60');
	INSERT INTO user (id, name, balance ) VALUES ('7','g','70');
	UPDATE user SET name='xxx', balance='999' WHERE AND id='1';
	UPDATE user SET name='yyy', balance='888' WHERE AND id='2';
COMMIT;


BEGIN TRANSACTION;
	INSERT INTO user (id, name, balance ) VALUES ('6','f','60');
	INSERT INTO user (id, name, balance ) VALUES ('7','g','70');
COMMIT;

BEGIN TRANSACTION;
    UPDATE user SET name='xxx', balance='999' WHERE AND id='1';
	UPDATE user SET name='yyy', balance='888' WHERE AND id='2';
COMMIT;

BEGIN TRANSACTION;
    DELETE FROM user WHERE id IN ('1');
    DELETE FROM user WHERE id IN ('2');
COMMIT;


INSERT INTO 'user'
SELECT 'name' AS 'name', 'balance' AS 'balance'
UNION ALL SELECT '1', '1'
UNION ALL SELECT '2', '2'
UNION ALL SELECT '3', '3'

CREATE TABLE IF NOT EXISTS user (
    id TEXT,
    name TEXT,
    balance REAL
)