SELECT * FROM customer_invoice ci ;
--DROP TABLE customer_invoice;
DELETE FROM customer_invoice;

INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('1','1','a','a','a','a','a','a','a','a','a');
INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('2','1','b','b','b','b','b','b','b','b','b');
INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('3','2','c','c','c','c','c','c','c','c','c');
INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('4','3','d','d','d','d','d','d','d','d','d');
INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('5','3','e','e','e','e','e','e','e','e','e');

INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('6a1e7584-b4ef-4726-b0e7-13da19d03bb6','6a1e7584-b4ef-4726-b0e7-13da19d03bb6','2023-10-13','','0','0','0','0','0','0','0'),('2b75adb5-b54d-4bd7-88ee-eee33c855f3e','6a1e7584-b4ef-4726-b0e7-13da19d03bb6','2023-10-13','','0','0','0','0','0','0','0');




BEGIN TRANSACTION;
	INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('6','4','f','f','f','f','f','f','f','f','f');
	INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('7','4','g','g','g','g','g','g','g','g','g');
	UPDATE customer_invoice SET date='x', products='x', carton='x', qty_ctn='x', total_qty='x', rate_each='x', debit='x', credit='x', balance='x' WHERE customer_id='1' AND id='1';
	UPDATE customer_invoice SET date='y', products='y', carton='y', qty_ctn='y', total_qty='y', rate_each='y', debit='y', credit='y', balance='y' WHERE customer_id='1' AND id='2';
COMMIT;

-- UPDATE products SET Qty=41 WHERE product_id=102;

BEGIN TRANSACTION;
	UPDATE customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('4','3','d','d','d','d','d','d','d','d','d');
	INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('5','3','e','e','e','e','e','e','e','e','e');
COMMIT;

DELETE FROM customer_invoice WHERE id IN ('1')