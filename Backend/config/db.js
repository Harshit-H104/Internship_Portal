const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'InternshipPortalSQL', // database name
  'root',                // mysql username (change if different)
  '1234',            // mysql password (change)
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;