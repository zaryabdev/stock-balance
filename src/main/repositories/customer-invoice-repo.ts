import logger from '../logger';

/*
  id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance,
*/

class CustomerInvoicRepository {
  constructor(dao) {
    console.log(`CustomerInvoicRepository constructor called`);
    this.dao = dao;
  }

  createTable() {
    console.log('createTable called for customer_invoice');
    const sql = `
        CREATE TABLE IF NOT EXISTS customer_invoice (
        id TEXT,
        customer_id TEXT,
        date TEXT,
        products TEXT,
        carton TEXT,
        qty_ctn TEXT,
        total_qty TEXT,
        rate_each TEXT,
        debit TEXT,
        credit TEXT,
        balance TEXT
        )`;

    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    const timestamp = Date.now();
    console.log('create called for CustomerInvoicRepository');
    const {
      id,
      customer_id,
      date,
      products,
      carton,
      qtyCtn,
      total_qty,
      rate_each,
      debit,
      credit,
      balance,
    } = data;

    console.log({
      id,
      customer_id,
      date,
      products,
      carton,
      qtyCtn,
      total_qty,
      rate_each,
      debit,
      credit,
      balance,
    });
    console.log(callbackFunction);
    this.dao.run(
      'INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?)',
      [
        id,
        customer_id,
        date,
        products,
        carton,
        qtyCtn,
        total_qty,
        rate_each,
        debit,
        credit,
        balance,
      ],
      data,
      callbackFunction,
    );
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM customer_invoice`, [], data, callbackFunction);
  }

  deleteRecords(data = [], callbackFunction) {
    console.log(`delete called`);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: { ...data },
        message: 'No records were deleted',
      };
      callbackFunction(res);
      return;
    }

    const newIds = data.join("','");
    const withQuote = `'${newIds}'`;
    const sql = `DELETE FROM customer_invoice WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    const {
      id,
      customer_id,
      date,
      products,
      carton,
      qtyCtn,
      total_qty,
      rate_each,
      debit,
      credit,
      balance,
    } = data;
    console.log('update called for CustomerInvoicRepository');
    console.log({
      id,
      customer_id,
      date,
      products,
      carton,
      qty_ctn,
      total_qty,
      rate_each,
      debit,
      credit,
      balance,
    });

    this.dao.run(
      'UPDATE customer_invoice SET  customer_id = ?, date = ?, products = ?, carton = ?, qty_ctn = ?, total_qty = ?, rate_each = ?, debit = ?, credit = ?, balance = ? WHERE id = ?',
      [
        customer_id,
        date,
        products,
        carton,
        qty_ctn,
        total_qty,
        rate_each,
        debit,
        credit,
        balance,
        id,
      ],
      data,
      callbackFunction,
    );
  }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default CustomerInvoicRepository;
