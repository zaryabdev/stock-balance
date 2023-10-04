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
        name TEXT,
        address TEXT,
        timestamp TEXT
        )`;

    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    debugger;
    const timestamp = Date.now();
    console.log('create called for CustomerRepository');
    const { id, name, address } = data;

    console.log({ id, name, address });
    console.log(callbackFunction);
    this.dao.run(
      'INSERT INTO customers (id, name, address, timestamp) VALUES (?,?,?,?)',
      [id, name, address, timestamp],
      callbackFunction,
    );
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

  // delete(id) {
  //   console.log(`delete called`);
  //   return this.dao.run(`DELETE FROM product_type WHERE id = ?`, [id]);
  // }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }

  // getAll() {
  //   logger.debug(`getAll called`);
  //   return this.dao.all(`SELECT * FROM product_type`);
  // }
}

module.exports = CustomerRepository;
