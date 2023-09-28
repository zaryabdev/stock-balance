const logger = require('../logger');

class PackingTypeRepository {
  constructor(dao) {
    console.log(`constructor called`);
    logger.debug('constructor called');
    this.dao = dao;
  }

  createTable() {
    logger.debug('createTable called for product_type');
    const sql = `
        CREATE TABLE IF NOT EXISTS product_type (
        id TEXT,
        name TEXT
        )`;
    return this.dao.run(sql);
  }

  create({ id, name }) {
    logger.debug('create called');
    console.log({ id, name });

    const result = this.dao.run(
      'INSERT INTO product_type (id,name) VALUES (?,?)',
      [id, name],
    );
    return result;
  }

  update(item) {
    console.log(`update called`);
    const { id, name } = item;
    const resultSet = this.dao.run(
      `UPDATE product_type
        SET name = ?
        WHERE id = ?`,
      [name, id],
    );
    console.log({ resultSet });
    return resultSet;
  }

  delete(id) {
    console.log(`delete called`);
    return this.dao.run(`DELETE FROM product_type WHERE id = ?`, [id]);
  }

  getById(id) {
    console.log(`getById called`);
    return this.dao.get(`SELECT * FROM product_type WHERE id = ?`, [id]);
  }

  getAll() {
    logger.debug(`getAll called`);
    return this.dao.all(`SELECT * FROM product_type`);
  }
}

module.exports = PackingTypeRepository;
