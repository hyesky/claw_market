require('dotenv').config();

module.exports = {
  host: process.env.DB_HOST || '70.39.197.194',
  port: parseInt(process.env.DB_PORT || '6033'),
  database: process.env.DB_NAME || 'claw_market',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Hyesky22',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
