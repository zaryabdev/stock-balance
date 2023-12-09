import logger from '../logger';

class CustomerRepository {
  constructor(dao) {
    console.log(`CustomerRepository constructor called`);
    this.dao = dao;
  }

  createTable() {
    console.log('createTable called for customer');
    const sql = `
        CREATE TABLE IF NOT EXISTS customer (
        id TEXT,
        key TEXT,
        name TEXT,
        address TEXT,
        phone TEXT,
        type TEXT,
        status TEXT,
        timestamp TEXT,
        meta_text TEXT,
        meta_number REAL
        )`;

    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    const timestamp = Date.now();
    console.log('create called for CustomerRepository');
    const { id, key, name, address, phone, type } = data;

    console.log({ id, key, name, address, phone, type });
    console.log(callbackFunction);
    this.dao.run(
      'INSERT INTO customer (id, key, name, address, phone, type, timestamp) VALUES (?,?,?,?,?,?,?)',
      [id, key, name, address, phone, type, timestamp],
      data,
      callbackFunction,
    );
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM customer`, [], data, callbackFunction);
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
    const sql = `DELETE FROM customer WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    const { id, key, name, address, phone } = data;
    console.log('update called for CustomerRepository');
    console.log({ id, key, name, address, phone });

    this.dao.run(
      'UPDATE customer SET  name = ?, address = ?, phone = ? WHERE id = ?',
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

export default CustomerRepository;
