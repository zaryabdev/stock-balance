SELECT * FROM customer;
SELECT * FROM customer_invoice ci ;
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

INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('6a1e7584-b4ef-4726-b0e7-13da19d03bb6','6a1e7584-b4ef-4726-b0e7-13da19d03bb6','2023-10-13','','0','0','0','0','0','0','0'),('2b75adb5-b54d-4bd7-88ee-eee33c855f3e','6a1e7584-b4ef-4726-b0e7-13da19d03bb6','2023-10-13','','0','0','0','0','0','0','0');


--DROP TABLE customer_invoice;
DELETE FROM customer_invoice;

BEGIN TRANSACTION;
	INSERT INTO 'customer' table VALUES ('1','a','a','a','a','a');
	INSERT INTO 'customer' table VALUES ('4','d','d','d','d','d');
COMMIT;

DELETE FROM customer WHERE id IN ('')