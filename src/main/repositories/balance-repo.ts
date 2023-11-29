import logger from '../logger';
const { v4: uuidv4 } = require('uuid');

class BalanceRepository {
  constructor(dao) {
    console.log(`BalanceRepository constructor called`);
    this.dao = dao;
  }

  createTable() {
    console.log('createTable called for balance');
    const sql = `
        CREATE TABLE IF NOT EXISTS balance (
          id TEXT,
          customer_id TEXT,
          balance REAL
        )`;
    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    console.log('create called for BalanceRepository');
    const { id, customer_id, balance } = data;

    console.log({ id, customer_id, balance });
    console.log(callbackFunction);
    this.dao.run(
      'INSERT INTO balance (id, customer_id, balance ) VALUES (?,?,?)',
      [id, customer_id, balance],
      data,
      callbackFunction,
    );
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM balance;`, [], data, callbackFunction);
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
    const sql = `DELETE FROM balance WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    console.log('update called for BalanceRepository');
    const { id, customer_id, balance } = data;

    let query = `UPDATE balance SET customer_id='${customer_id}', balance='${balance}' WHERE id='${id}';`;

    console.log({ id, customer_id, balance });
    console.log(callbackFunction);
    this.dao.run(query, [], data, callbackFunction);
  }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default BalanceRepository;
