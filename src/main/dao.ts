import sqlite from 'sqlite3';

const sqlite3 = sqlite.verbose();
// const Database = new sqlite3.Database(':memory:');

const logger = require('./logger');

const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, {
      verbose: console.log(`Connected to Database located at ${dbFilePath}`),
    });
  }

  run(sql, params = [], callbackFunction) {
    console.log('DAO : run');
    console.log(callbackFunction);

    let res = {
      status: '',
      data: {},
      message: '',
    };
    const query = this.db.prepare(sql);

    console.log('before query.run');

    query.run([...params], (err) => {
      debugger;
      if (err) {
        res.status = STATUS.FAILED;
        console.log(err);
        if (callbackFunction) callbackFunction(res, err);
      } else {
        res.status = STATUS.SUCCESS;
        res.message = 'Record created successfully.';
        console.log('inside query.run');
        console.log(this.lastID);
        console.log('TEST');
        if (callbackFunction) callbackFunction(res);
      }
    });

    debugger;
  }

  // async get(sql, params = []) {
  //   logger.debug('DAO : get');
  //   const stmt = this.db.prepare(sql);
  //   try {
  //     const result = await stmt.get(params);
  //     console.log(result);
  //     return result;
  //   } catch (error) {
  //     logger.error('DAO : get');
  //     console.log(error);
  //   }
  //   return {};
  // }

  // async all(sql, params = []) {
  //   logger.debug('DAO : all');
  //   const stmt = this.db.prepare(sql);
  //   try {
  //     const resultSet = await stmt.all(params);
  //     console.log(resultSet);
  //     return resultSet;
  //   } catch (error) {
  //     logger.error('DAO : all');
  //     console.log(error);
  //   }
  //   return [];
  // }
}

module.exports = AppDAO;

// const sqlite3 = sqlite.verbose();
// const db = new sqlite3.Database(':memory:');

// db.serialize(() => {
//   db.run('CREATE TABLE lorem (info TEXT)');

//   const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
//   for (let i = 0; i < 10; i += 1) {
//     stmt.run(`Ipsum ${i}`);
//   }
//   stmt.finalize();

//   db.each('SELECT rowid AS id, info FROM lorem', (_err: any, row: any) => {
//     console.log(`${row.id}: ${row.info}`);
//   });
// });

// db.close();
