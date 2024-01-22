https://www.sqlite.org/limits.html#max_variable_number

SELECT _ FROM customer_invoice WHERE id = '352634ac-e7a5-46a5-87cd-b66645615ef6';
SELECT _ FROM customer;
SELECT \* FROM product;

SELECT DISTINCT (id) FROM customer_invoice;

SELECT
id, COUNT(_)
FROM
customer_invoice
GROUP BY
id
HAVING
COUNT(_) > 1;

-- DELETE All Data
delete FROM customer_invoice;
delete FROM customer;
delete FROM product;
-- delete FROM stock;

-- SELECT \* FROM stock;
