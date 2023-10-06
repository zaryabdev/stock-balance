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
    debugger;
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

  delete(data) {
    console.log(`delete called`);
    return this.dao.run(`DELETE FROM product_type WHERE id = ?`, [id]);
  }

  // update(item) {
  //   console.log(`update called`);
  //   const { id, name } = item;
  //   const resultSet = this.dao.run(
  //     `UPDATE product_type
  //       SET name = ?
  //       WHERE id = ?`,
  //     [name, id],
  //   );
  //   console.log({ resultSet });
  //   return resultSet;
  // }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

module.exports = CustomerRepository;
