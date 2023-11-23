import logger from '../logger';

const { v4: uuidv4 } = require('uuid');

class ProductRepository {
  constructor(dao) {
    console.log(`ProductRepository constructor called`);
    this.dao = dao;
  }

  createTable() {
    console.log('createTable called for product');
    const sql = `
        CREATE TABLE IF NOT EXISTS product (
          id TEXT,
          customer_id TEXT,
          value TEXT,
          label INTEGER,
          qty_ctn INTEGER
        )`;
    return this.dao.run(sql);
  }

  create(data, callbackFunction) {
    console.log('create called for ProductRepository');
    console.log(data);

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
      const _str = `('${el.id}','${el.customer_id}','${el.label}','${el.qty_ctn}','${el.value}')`;
      return _str;
    });

    console.log(valuesArr);

    const valuesStr = valuesArr.join(',');

    console.log(valuesStr);

    const query = `INSERT INTO product (id, customer_id, label, qty_ctn, value) VALUES ${valuesStr};`;

    this.dao.run(query, [], data, callbackFunction);
  }

  getAll(data, callbackFunction) {
    logger.debug(`getAll called`);
    this.dao.all(`SELECT * FROM product;`, [], data, callbackFunction);
  }

  getAllById(data, callbackFunction) {
    logger.debug(`getAll called`);

    const { customer_id } = data;

    this.dao.all(
      `SELECT * FROM product WHERE customer_id = '${customer_id}';`,
      [],
      data,
      callbackFunction,
    );
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
    const sql = `DELETE FROM product WHERE id IN (${withQuote})`;

    return this.dao.run(sql, [], data, callbackFunction);
  }

  update(data, callbackFunction) {
    // const { id, product, carton, qty_ctn, total_qty } = data;
    // console.log('update called for ProductRepository');
    // console.log({ id, product, carton, qty_ctn, total_qty });

    // this.dao.run(
    //   'UPDATE product SET  product = ?, carton = ?, qty_ctn = ?, total_qty = ? WHERE id = ?',
    //   [product, carton, qty_ctn, total_qty, id],
    //   data,
    //   callbackFunction,
    // );

    const currentThis = this;

    console.log('update called for ProductRepository');
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

      if (record.id === 'NEW') {
        toCreate.push(record);
      } else {
        toUpdate.push(record);
      }
    }
    console.log('--------------DATA-------------------');
    console.log('toCreate');
    console.log(toCreate);
    console.log('toUpdate');
    console.log(toUpdate);
    console.log('--------------DATA-------------------');

    // create records
    if (toCreate.length > 0) {
      console.log(`Length of toCreate${toCreate.length}`);

      // const { id, customer_id, value, label, qty_ctn } = data;

      const formatedSqlValuesArr = toCreate.map((el) => {
        const id = uuidv4();
        return `('${id}','${el.customer_id}','${el.value}','${el.label}','${el.qty_ctn}')`;
      });

      console.log(formatedSqlValuesArr);

      const formatedSqlValuesStr = formatedSqlValuesArr.join(',');
      // console.log(valuesStr);

      const insertQuery = `INSERT INTO product (id, customer_id, value, label, qty_ctn) VALUES ${formatedSqlValuesStr};`;

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
          // const { id, customer_id, value, label, qty_ctn } = data;
          const query = `
          UPDATE product SET customer_id='${record.customer_id}', value='${record.value}', label='${record.label}', qty_ctn='${record.qty_ctn}' WHERE id='${record.id}';
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

  // getById(id) {
  //   console.log(`getById called`);
  //   return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  // }
}

export default ProductRepository;
