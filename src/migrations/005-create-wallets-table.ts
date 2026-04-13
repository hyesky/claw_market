exports.up = async (queryInterface: any) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      id CHAR(36) PRIMARY KEY,
      creator_id CHAR(36) NOT NULL UNIQUE,
      balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
      currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
      pending_withdrawal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id CHAR(36) PRIMARY KEY,
      wallet_id CHAR(36) NOT NULL,
      order_id CHAR(36),
      amount DECIMAL(12, 2) NOT NULL,
      type ENUM('deposit', 'withdrawal', 'commission', 'refund') NOT NULL,
      status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS withdrawal_requests (
      id CHAR(36) PRIMARY KEY,
      wallet_id CHAR(36) NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      bank_account VARCHAR(100),
      crypto_wallet VARCHAR(255),
      status ENUM('pending', 'approved', 'rejected', 'processed') NOT NULL DEFAULT 'pending',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query('CREATE UNIQUE INDEX wallets_creator_id_idx ON wallets(creator_id);');
  await queryInterface.sequelize.query('CREATE INDEX transactions_wallet_id_idx ON transactions(wallet_id);');
  await queryInterface.sequelize.query('CREATE INDEX transactions_order_id_idx ON transactions(order_id);');
  await queryInterface.sequelize.query('CREATE INDEX transactions_type_idx ON transactions(type);');
  await queryInterface.sequelize.query('CREATE INDEX withdrawal_requests_wallet_id_idx ON withdrawal_requests(wallet_id);');
  await queryInterface.sequelize.query('CREATE INDEX withdrawal_requests_status_idx ON withdrawal_requests(status);');
};

exports.down = async (queryInterface: any) => {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS withdrawal_requests;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS transactions;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS wallets;');
};
