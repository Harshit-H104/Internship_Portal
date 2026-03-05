const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Application = sequelize.define('Application', {

  company: DataTypes.STRING,
  role: DataTypes.STRING,

  office: DataTypes.STRING,
  stipend: DataTypes.STRING,

  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  resumeLink: DataTypes.STRING

}, {
  timestamps: true
});

User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

module.exports = Application;