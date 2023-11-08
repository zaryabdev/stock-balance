import { SOURCE, STATE, STATUS } from '../../renderer/contants';
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
        source TEXT,
        state TEXT,
        date TEXT,
        product TEXT,
        payment TEXT,
        carton INTEGER,
        qty_ctn INTEGER,
        total_qty INTEGER,
        rate_each REAL,
        debit REAL,
        credit REAL,
        balance REAL
        )`;

    return this.dao.run(sql);
  }

  // create(data = [], callbackFunction) {
  //   console.log('create called for CustomerInvoicRepository');
  //   console.log(data);

  //   if (data.length === 0) {
  //     const res = {
  //       status: 'SUCCESS',
  //       data: [...data],
  //       message: 'No records were created',
  //     };
  //     callbackFunction(res);
  //     return;
  //   }

  //   console.log(callbackFunction);

  //   const valuesArr = data.map((el) => {
  //     const _str = `('${el.id}','${el.customer_id}','${el.source}','${el.state}','${el.date}','${el.products}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}')`;
  //     return _str;
  //   });

  //   console.log(valuesArr);

  //   const valuesStr = valuesArr.join(',');

  //   console.log(valuesStr);

  //   const query = `INSERT INTO customer_invoice (id, customer_id, source, state, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ${valuesStr};`;

  //   this.dao.run(query, [], data, callbackFunction);
  // }

  update(data = [], callbackFunction) {
    // const timestamp = Date.now();
    console.log('update called for CustomerInvoicRepository');
    console.log(data);
    const toCreate = [];
    const toUpdate = [];
    const toDelete = [];

    for (let index = 0; index < data.length; index++) {
      const record = data[index];
      if (record.source === SOURCE.memory) {
        if (record.state === STATE.created || record.state === STATE.updated) {
          toCreate.push({
            ...record,
            source: SOURCE.database,
            state: STATE.created,
          });
        }
      } else if (record.source === SOURCE.database) {
        if (record.state === STATE.updated) {
          toUpdate.push({
            ...record,
            source: SOURCE.database,
            state: STATE.updated,
          });
        }
        if (record.state === STATE.deleted) {
          toDelete.push({
            ...record,
            source: SOURCE.database,
            state: STATE.deleted,
          });
        }
      }
    }

    console.log('toCreate');
    console.log(toCreate);
    console.log('toUpdate');
    console.log(toUpdate);
    console.log('toCreate');
    console.log(toDelete);

    // const valuesArr = data.map((el) => {
    //   const _str = `('${el.id}','${el.customer_id}','${el.source}','${el.state}','${el.date}','${el.products}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}')`;
    //   return _str;
    // });

    // console.log(valuesArr);
    // const valuesStr = valuesArr.join(',');
    // console.log(valuesStr);
    // const query = `INSERT INTO customer_invoice (id, customer_id, source, state, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ${valuesStr};`;

    // if (data.length === 0) {
    //   const res = {
    //     status: 'SUCCESS',
    //     data: [...data],
    //     message: 'No records were updated',
    //   };
    //   callbackFunction(res);
    //   return;
    // }
    // console.log(callbackFunction);
    // const valuesArr = data.map((el) => {
    //   const _str = `('${el.id}','${el.customer_id}','${el.date}','${el.products}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}')`;
    //   return _str;
    // });
    // console.log(valuesArr);
    // const valuesStr = valuesArr.join(',');
    // console.log(valuesStr);
    // const query = `
    // BEGIN TRANSACTION;
    // INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('6','4','f','f','f','f','f','f','f','f','f');
    // INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('7','4','g','g','g','g','g','g','g','g','g');
    // UPDATE customer_invoice SET date='x', products='x', carton='x', qty_ctn='x', total_qty='x', rate_each='x', debit='x', credit='x', balance='x' WHERE customer_id='1' AND id='1';
    // UPDATE customer_invoice SET date='y', products='y', carton='y', qty_ctn='y', total_qty='y', rate_each='y', debit='y', credit='y', balance='y' WHERE customer_id='1' AND id='2';
    // COMMIT;`;
    // this.dao.run('BEGIN TRANSACTION', [], data, callbackFunction);
    // this.dao.run(
    //   "INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('6','4','f','f','f','f','f','f','f','f','f');",
    //   [],
    //   data,
    //   callbackFunction,
    // );
    // this.dao.run(
    //   "INSERT INTO customer_invoice (id, customer_id, date, products, carton, qty_ctn, total_qty, rate_each, debit, credit, balance) VALUES ('7','4','g','g','g','g','g','g','g','g','g');",
    //   [],
    //   data,
    //   callbackFunction,
    // );
    // this.dao.run(
    //   "UPDATE customer_invoice SET date='x', products='x', carton='x', qty_ctn='x', total_qty='x', rate_each='x', debit='x', credit='x', balance='x' WHERE customer_id='1' AND id='1';",
    //   [],
    //   data,
    //   callbackFunction,
    // );
    // this.dao.run(
    //   " UPDATE customer_invoice SET date='y', products='y', carton='y', qty_ctn='y', total_qty='y', rate_each='y', debit='y', credit='y', balance='y' WHERE customer_id='1' AND id='2';",
    //   [],
    //   data,
    //   callbackFunction,
    // );
    this.dao.run('COMMIT', [], data, callbackFunction);
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM customer_invoice`, [], data, callbackFunction);
  }

  deleteRecords(data = [], callbackFunction) {
    // console.log(`delete called`);
    // if (data.length === 0) {
    //   const res = {
    //     status: 'SUCCESS',
    //     data: { ...data },
    //     message: 'No records were deleted',
    //   };
    //   callbackFunction(res);
    //   return;
    // }
    // const newIds = data.join("','");
    // const withQuote = `'${newIds}'`;
    // const sql = `DELETE FROM customer_invoice WHERE id IN (${withQuote})`;
    // return this.dao.run(sql, [], data, callbackFunction);
  }

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default CustomerInvoicRepository;
