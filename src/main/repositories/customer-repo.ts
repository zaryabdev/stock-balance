const logger = require('../logger');

class CustomerRepository {
  constructor(dao) {
    console.log(`CustomerRepository constructor called`);
    logger.debug('CustomerRepository constructor called');
    this.dao = dao;
  }

  createTable() {
    logger.debug('createTable called for customers');
    const sql = `
        CREATE TABLE IF NOT EXISTS customers (
        id TEXT,
        name TEXT,
        address TEXT,
        balance TEXT,
        credit TEXT
        )`;
    return this.dao.run(sql);
  }

  create({ id, name, address, balance, credit }) {
    logger.debug('create called for CustomerRepository');
    console.log({ id, name, address, balance, credit });

    const result = this.dao.run(
      'INSERT INTO customers (id, name, address, balance, credit) VALUES (?,?,?,?,?)',
      [id, name, address, balance, credit],
    );
    console.log('Data entry was success');

    console.log(result);
    return result;
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
