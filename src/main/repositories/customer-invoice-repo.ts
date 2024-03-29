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

  update(data = [], callbackFunction) {
    const currentThis = this;
    // const timestamp = Date.now();
    console.log('update called for CustomerInvoicRepository');
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

    let toCreate = [];
    let toUpdate = [];

    for (let index = 0; index < data.length; index++) {
      const record = data[index];

      if (record.source === SOURCE.memory) {
        if (record.state === STATE.created || record.state === STATE.updated) {
          toCreate.push({
            ...record,
            source: SOURCE.database,
            state: STATE.none,
          });
        }
        if (record.state === STATE.deleted) {
          console.log(
            `Ignored record ${record.id}, state : ${record.state}, source : ${record.source}`,
          );
        }
        if (record.state === STATE.none) {
          console.log(
            `Ignored record ${record.id}, state : ${record.state}, source : ${record.source}`,
          );
        }
      } else if (record.source === SOURCE.database) {
        if (record.state === STATE.none) {
          console.log(
            `Ignored record ${record.id}, state : ${record.state}, source : ${record.source}`,
          );
        }

        if (record.state === STATE.created) {
          // This can never happen
          console.log(
            `Ignored record ${record.id}, state : ${record.state}, source : ${record.source}`,
          );
        }

        if (record.state === STATE.updated) {
          toUpdate.push({
            ...record,
            source: SOURCE.database,
            state: STATE.none,
          });
        }

        if (record.state === STATE.deleted) {
          toUpdate.push({
            ...record,
            source: SOURCE.database,
            state: STATE.deleted,
          });
        }
      }
    }
    console.log('--------------DATA-------------------');
    console.log('toCreate');
    console.log(toCreate.length);
    console.log('toUpdate');
    console.log(toUpdate.length);
    console.log('--------------DATA-------------------');

    // create records
    if (toCreate.length > 0) {
      console.log(`Length of toCreate${toCreate.length}`);

      const formatedSqlValuesArr = toCreate.map((el) => {
        return `('${el.id}','${el.customer_id}','${el.source}','${el.state}','${el.date}','${el.product}','${el.payment}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}','${el.current_balance}')`;
      });

      // console.log(valuesArr);
      const formatedSqlValuesStr = formatedSqlValuesArr.join(',');
      // console.log(valuesStr);

      const insertQuery = `INSERT INTO customer_invoice (id, customer_id, source, state, date, product, payment, carton, qty_ctn, total_qty, rate_each, debit, credit, balance, current_balance) VALUES ${formatedSqlValuesStr};`;

      // console.log('Test in DBeaver');
      // console.log(insertQuery);

      this.dao.run(insertQuery, [], data, toUpdateCbFunc);
    } else {
      console.log(`Length of toCreate${toCreate.length}`);
      console.log('Going to call updateRecords() because nothing to create...');
      updateRecords({ status: 'SUCCESS' });
    }

    function toUpdateCbFunc(res) {
      console.log('Inside toUpdateCbFunc');
      console.log(res.status);

      if (res.status === 'SUCCESS') {
        updateRecords();
      } else {
        // Failed case
        console.log(res);
      }
    }

    function updateRecords() {
      console.log('Inside updateRecords');
      if (toUpdate.length > 0) {
        console.log('Going to update records');

        let updatedRecords = toUpdate.length;

        for (let index = 0; index < toUpdate.length; index++) {
          const record = toUpdate[index];
          const query = `
          UPDATE customer_invoice SET state='${record.state}', date='${record.date}', product='${record.product}', payment='${record.payment}', carton='${record.carton}', qty_ctn='${record.qty_ctn}', total_qty='${record.total_qty}', rate_each='${record.rate_each}', debit='${record.debit}', credit='${record.credit}', balance='${record.balance}', current_balance='${record.current_balance}' WHERE id='${record.id}';
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
              data: [...toCreate, ...toUpdate],
              message: 'All records updated successfulyy',
            });
            toCreate = [];
            toUpdate = [];
          }, 500);
        }
      } else {
        console.log(`Length of toUpdate${toUpdate.length}`);
        console.log(
          'Going to call callbackFunction() because nothing to update...',
        );
        callbackFunction({
          status: 'SUCCESS',
          data: [...toCreate, ...toUpdate],
          message: 'All records updated successfulyy',
        });
        toCreate.length = 0;
        toUpdate.length = 0;
      }
    }
  }

  deleteDuplicated(data = [], callbackFunction) {
    const currentThis = this;
    // const timestamp = Date.now();
    console.log('deleteDuplicated called for CustomerInvoicRepository');
    console.log(`Data length : ${data.length}`);
    console.log(`Data length : ${data}`);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: [],
        message: 'No records were updated',
      };
      callbackFunction(res);
      return;
    }

    let toDelete = [];
    let toCreate = [];

    for (let index = 0; index < data.length; index++) {
      const record = data[index];
      toDelete.push(record.id);
      toCreate.push(record);
    }
    console.log('--------------DATA-------------------');
    console.log('toCreate');
    console.log(toCreate.length);
    console.log('toDelete');
    console.log(toDelete.length);
    console.log('--------------DATA-------------------');

    // delete records

    if (toDelete.length > 0) {
      console.log(`delete called`);

      const idsToDelete = toDelete.join("','");
      const withQuote = `'${idsToDelete}'`;
      const sql = `DELETE FROM customer_invoice WHERE id IN (${withQuote})`;
      return this.dao.run(sql, [], data, toCreateCbFunc);
    }

    function toCreateCbFunc(res) {
      console.log('Inside toCreateCbFunc');
      console.log(res.status);

      if (res.status === 'SUCCESS') {
        createDuplicatedRecords();
      } else {
        // Failed case
        console.log(res);
      }
    }

    function createDuplicatedRecords() {
      console.log('Inside updateRecords');
      if (toCreate.length > 0) {
        console.log('Going to update records');

        console.log(`Length of toCreate${toCreate.length}`);

        const formatedSqlValuesArr = toCreate.map((el) => {
          return `('${el.id}','${el.customer_id}','${el.source}','${el.state}','${el.date}','${el.product}','${el.payment}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}','${el.current_balance}')`;
        });

        // console.log(valuesArr);
        const formatedSqlValuesStr = formatedSqlValuesArr.join(',');
        // console.log(valuesStr);

        const insertQuery = `INSERT INTO customer_invoice (id, customer_id, source, state, date, product, payment, carton, qty_ctn, total_qty, rate_each, debit, credit, balance, current_balance) VALUES ${formatedSqlValuesStr};`;

        console.log('Test in DBeaver');
        console.log(insertQuery);

        currentThis.dao.run(insertQuery, [], data, (res) => {
          if (res.status === 'SUCCESS') {
            callbackFunction({
              status: 'SUCCESS',
              data: [...toCreate],
              message: 'All records created successfulyy',
            });
          }
        });
      }
    }
  }

  createTable() {
    console.log('createTable called for customer_invoice');
    const sql = `
        CREATE TABLE IF NOT EXISTS customer_invoice (
        id TEXT,
        customer_id TEXT,
        source TEXT,
        state TEXT,
        status TEXT,
        date TEXT,
        product TEXT,
        payment TEXT,
        carton INTEGER,
        qty_ctn INTEGER,
        total_qty INTEGER,
        rate_each REAL,
        debit REAL,
        credit REAL,
        balance REAL,
        current_balance REAL,
        timestamp TEXT,
        date_created TEXT,
        date_modified TEXT,
        meta_text TEXT,
        meta_number REAL,
        data_json TEXT
        )`;

    return this.dao.run(sql);
  }

  create(data = [], callbackFunction) {
    console.log('create called for CustomerInvoicRepository');
    // console.log(data);

    if (data.length === 0) {
      const res = {
        status: 'SUCCESS',
        data: [...data],
        message: 'No records were created',
      };
      callbackFunction(res);
      return;
    }

    console.log(callbackFunction);

    const valuesArr = data.map((el) => {
      const _str = `('${el.id}','${el.customer_id}','${el.source}','${STATE.none}','${el.date}','${el.products}','${el.payment}','${el.carton}','${el.qty_ctn}','${el.total_qty}','${el.rate_each}','${el.debit}','${el.credit}','${el.balance}','${el.current_balance}')`;
      return _str;
    });

    console.log(valuesArr);

    const valuesStr = valuesArr.join(',');

    console.log(valuesStr);

    const query = `INSERT INTO customer_invoice (id, customer_id, source, state, date, products, payment, carton, qty_ctn, total_qty, rate_each, debit, credit, balance, current_balance) VALUES ${valuesStr};`;

    this.dao.run(query, [], data, callbackFunction);
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(
      `
        SELECT
        ci.*,
        c.type
        FROM
        customer_invoice ci
        INNER JOIN customer c ON
        ci.customer_id = c.id
        WHERE ci.state != 'DELETED';
  `,
      [],
      data,
      callbackFunction,
    );
  }

  getById(data, callbackFunction) {
    logger.debug(`getById called`);

    const { id } = data;

    const getQuery = `SELECT * FROM customer_invoice WHERE customer_id = '${id}' AND STATE != 'DELETED';`;

    console.log('Run this in DBeaver');
    console.log(getQuery);

    this.dao.all(getQuery, [], data, callbackFunction);
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

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default CustomerInvoicRepository;
