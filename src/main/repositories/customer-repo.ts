const logger = require('../logger');

class CustomerRepository {
  constructor(dao) {
    console.log(`CustomerRepository constructor called`);
    this.dao = dao;
  }

  createTable() {
    console.log('createTable called for customers');
    const sql = `
        CREATE TABLE IF NOT EXISTS customers (
        id TEXT,
        key TEXT,
        name TEXT,
        address TEXT,
        phone TEXT,
        timestamp TEXT
        )`;

    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    const timestamp = Date.now();
    console.log('create called for CustomerRepository');
    const { id, key, name, address, phone } = data;

    console.log({ id, key, name, address, phone });
    console.log(callbackFunction);
    this.dao.run(
      'INSERT INTO customers (id, key, name, address, phone, timestamp) VALUES (?,?,?,?,?,?)',
      [id, key, name, address, phone, timestamp],
      data,
      callbackFunction,
    );
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM customers`, [], data, callbackFunction);
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

    let newIds = data.join("','");
    let withQuote = `'${newIds}'`;
    let sql = `DELETE FROM customers WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    const { id, key, name, address, phone } = data;
    console.log('update called for CustomerRepository');
    console.log({ id, key, name, address, phone });

    this.dao.run(
      'UPDATE customers SET  name = ?, address = ?, phone = ? WHERE id = ?',
      [name, address, phone, id],
      data,
      callbackFunction,
    );
  }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

module.exports = CustomerRepository;
