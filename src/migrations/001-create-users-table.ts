exports.up = async (queryInterface: any) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20) UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('buyer', 'creator', 'admin') NOT NULL DEFAULT 'buyer',
      real_name VARCHAR(100),
      openclaw_workspace_id VARCHAR(255),
      status ENUM('active', 'suspended', 'banned') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      token TEXT NOT NULL,
      refresh_token TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query('CREATE INDEX users_email_idx ON users(email);');
  await queryInterface.sequelize.query('CREATE INDEX users_phone_idx ON users(phone);');
  await queryInterface.sequelize.query('CREATE INDEX users_role_idx ON users(role);');
  await queryInterface.sequelize.query('CREATE INDEX user_sessions_user_id_idx ON user_sessions(user_id);');
  await queryInterface.sequelize.query('CREATE INDEX user_sessions_expires_at_idx ON user_sessions(expires_at);');
};

exports.down = async (queryInterface: any) => {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS user_sessions;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
};
