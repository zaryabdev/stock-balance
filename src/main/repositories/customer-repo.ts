import { TYPE } from '../../renderer/contants';
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
        date_created TEXT,
        date_modified TEXT,
        meta_text TEXT,
        meta_number REAL,
        data_json TEXT
        )`;

    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    const timestamp = Date.now();
    console.log('create called for CustomerRepository');
    const { id, key, name, address, phone, type } = data;

    // console.log({ id, key, name, address, phone, type });

    this.dao.run(
      'INSERT INTO customer (id, key, name, address, phone, type, timestamp) VALUES (?,?,?,?,?,?,?)',
      [id, key, name, address, phone, type, timestamp],
      data,
      callbackFunction,
    );
  }

  getAll(data, callbackFunction) {
    console.log('getAll called for CustomerRepository');
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM customer;`, [], data, callbackFunction);
  }

  deleteRecords(data = [], callbackFunction) {
    console.log(`deleteRecords called for CustomerRepository`);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: { ...data },
        message: 'No records were deleted',
      };
      console.log(res.message);
      callbackFunction(res);
      return;
    }

    const newIds = data.join("','");
    const withQuote = `'${newIds}'`;
    const sql = `DELETE FROM customer WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    console.log('update called for CustomerRepository');

    const { id, key, name, address, phone } = data;
    // console.log({ id, key, name, address, phone });

    this.dao.run(
      'UPDATE customer SET  name = ?, address = ?, phone = ? WHERE id = ?',
      [name, address, phone, id],
      data,
      callbackFunction,
    );
  }

  archiveRecords(data = [], callbackFunction) {
    console.log('archive called for CustomerRepository');

    const currentThis = this;
    // const timestamp = Date.now();
    console.log(`Data length : ${data.length}`);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: [],
        message: 'No records were updated',
      };
      console.log(message);
      callbackFunction(res);
      return;
    }

    if (data.length > 0) {
      let updatedRecords = data.length;

      for (let index = 0; index < data.length; index++) {
        const id = data[index];
        const query = `
          UPDATE customer SET status='${TYPE.archived}' WHERE id='${id}';
        `;

        currentThis.dao.run(query, [], data, (res) => {
          if (res.status === 'SUCCESS') {
            console.log('Update was success');
            // console.log(res);
          }
        });
        updatedRecords -= 1;
      }

      console.log('All records updated');

      if (updatedRecords === 0) {
        setTimeout(() => {
          callbackFunction({
            status: 'SUCCESS',
            data: [...data],
            message: 'All records updated successfulyy',
          });
        }, 500);
      }
    } else {
      console.log(`Length of toUpdate : ${data.length}`);

      callbackFunction({
        status: 'SUCCESS',
        data: [...data],
        message: 'All records updated successfulyy',
      });
    }
  }

  unarchiveRecords(data = [], callbackFunction) {
    console.log(`unarchive called`);

    const currentThis = this;
    // const timestamp = Date.now();
    console.log('unarchive called for CustomerRepository');
    console.log(`Data length : ${data.length}`);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: [],
        message: 'No records were updated',
      };
      callbackFunction(res);
      return;
    }

    console.log('Inside updateRecords');

    if (data.length > 0) {
      console.log('Going to update records');

      let updatedRecords = data.length;

      for (let index = 0; index < data.length; index++) {
        const id = data[index];
        const query = `
          UPDATE customer SET status='${TYPE.unarchived}' WHERE id='${id}';
        `;

        currentThis.dao.run(query, [], data, (res) => {
          if (res.status === 'SUCCESS') {
            console.log('Update was success');
            console.log(res);
          }
        });
        updatedRecords -= 1;
      }

      console.log('All records updated');

      if (updatedRecords === 0) {
        setTimeout(() => {
          callbackFunction({
            status: 'SUCCESS',
            data: [...data],
            message: 'All records updated successfulyy',
          });
        }, 500);
      }
    } else {
      console.log(`Length of toUpdate${data.length}`);
      console.log(
        'Going to call callbackFunction() because nothing to update...',
      );
      callbackFunction({
        status: 'SUCCESS',
        data: [...data],
        message: 'All records updated successfulyy',
      });
    }
  }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default CustomerRepository;
