import sqlite from 'sqlite3';

const sqlite3 = sqlite.verbose();
// const Database = new sqlite3.Database(':memory:');

const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, {
      verbose: console.log(`Connected to Database : ${dbFilePath}`),
    });
  }

  run(sql, params = [], data, callbackFunction) {
    console.log('DAO : run');
    console.log(
      `This SQL will run \n\n-------------SQL START----------------\n${sql}\n-------------SQL END----------------\n`,
    );

    const query = this.db.prepare(sql);

    const res = {
      status: '',
      data,
      message: '',
    };

    query.run([...params], (err) => {
      if (err) {
        res.status = STATUS.FAILED;
        res.message = 'Error occured in query run command.';
        console.error(res.message);
        console.error(err);
        if (callbackFunction) callbackFunction(res, err);
      } else {
        res.status = STATUS.SUCCESS;
        res.message = 'Query ran successfully.';
        console.log('Query ran successfully.');
        if (callbackFunction) callbackFunction(res);
      }
    });
  }

  all(sql, params = [], data, callbackFunction) {
    console.log('DAO : all');
    console.log(
      `This SQL will run \n\n-------------SQL START----------------\n${sql}\n-------------SQL END----------------\n`,
    );

    const query = this.db.prepare(sql);
    const res = {
      status: '',
      data: { ...data },
      message: '',
    };

    query.all([...params], (err, rows) => {
      if (err) {
        res.status = STATUS.FAILED;
        res.message = 'Error occured in query all command.';
        console.log(res.message);
        console.error(err);
        if (callbackFunction) callbackFunction(res, err);
      } else {
        // rows.forEach((row) => {
        // console.log(row);
        // });

        res.status = STATUS.SUCCESS;
        res.message = 'Records fetched successfully.';
        res.data = rows;

        console.log(
          'Total | ' + rows.length + ' | Records fetched successfully.',
        );

        if (callbackFunction) callbackFunction(res);
      }
    });
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
}

export default AppDAO;

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
