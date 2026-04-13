import mysql from 'mysql2/promise';

async function createDatabase() {
  const config = {
    host: process.env.DB_HOST || '70.39.197.194',
    port: parseInt(process.env.DB_PORT || '6033'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Hyesky22',
  };

  console.log(`Connecting to MySQL at ${config.host}:${config.port}...`);

  let connection;
  try {
    // Connect without database
    connection = await mysql.createConnection({
      ...config,
    });

    console.log('✅ Connected to MySQL server');

    const dbName = process.env.DB_NAME || 'claw_market';
    console.log(`Creating database: ${dbName}...`);

    // Drop database if exists
    try {
      await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
      console.log('✅ Dropped existing database (if any)');
    } catch (error) {
      console.log('⚠️ Could not drop database:', (error as Error).message);
    }

    // Create database
    await connection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created successfully`);

    // Use the new database and verify
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Using database '${dbName}'`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connection closed');
    }
  }
}

createDatabase();
