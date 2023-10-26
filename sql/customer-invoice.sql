SELECT * FROM customer;

INSERT INTO customer (id, key, name, address, phone, timestamp) VALUES ('1','a','a','a','a','a');
INSERT INTO customer (id, key, name, address, phone, timestamp) VALUES ('2','b','b','b','b','b');
INSERT INTO customer (id, key, name, address, phone, timestamp) VALUES ('3','c','c','c','c','c');
INSERT INTO customer (id, key, name, address, phone, timestamp) VALUES ('4','d','d','d','d','d');
INSERT INTO customer (id, key, name, address, phone, timestamp) VALUES ;

INSERT INTO customer (id, key, name, address, phone, timestamp)
VALUES
('5','e','e','e','e','e'),
('6','g','e','e','e','e'),
('7','e','7','e','e','e');

DELETE FROM customer;

BEGIN TRANSACTION;
	INSERT INTO 'customer' table VALUES ('1','a','a','a','a','a');
	INSERT INTO 'customer' table VALUES ('4','d','d','d','d','d');
COMMIT;

DELETE FROM customer WHERE id IN ('')