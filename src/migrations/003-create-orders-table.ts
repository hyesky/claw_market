exports.up = async (queryInterface: any) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id CHAR(36) PRIMARY KEY,
      buyer_id CHAR(36) NOT NULL,
      product_id CHAR(36) NOT NULL,
      version_id CHAR(36),
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
      payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
      payment_method VARCHAR(50),
      authorization_type VARCHAR(50),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (version_id) REFERENCES soul_versions(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id CHAR(36) PRIMARY KEY,
      order_id CHAR(36) NOT NULL,
      product_id CHAR(36) NOT NULL,
      version_id CHAR(36),
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (version_id) REFERENCES soul_versions(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS authorization_records (
      id CHAR(36) PRIMARY KEY,
      order_id CHAR(36) NOT NULL,
      workspace_id VARCHAR(255) NOT NULL,
      authorization_scope VARCHAR(100) NOT NULL,
      expires_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query('CREATE INDEX orders_buyer_id_idx ON orders(buyer_id);');
  await queryInterface.sequelize.query('CREATE INDEX orders_product_id_idx ON orders(product_id);');
  await queryInterface.sequelize.query('CREATE INDEX orders_payment_status_idx ON orders(payment_status);');
  await queryInterface.sequelize.query('CREATE INDEX orders_created_at_idx ON orders(created_at);');
  await queryInterface.sequelize.query('CREATE INDEX order_items_order_id_idx ON order_items(order_id);');
  await queryInterface.sequelize.query('CREATE INDEX order_items_product_id_idx ON order_items(product_id);');
  await queryInterface.sequelize.query('CREATE INDEX authorization_records_order_id_idx ON authorization_records(order_id);');
  await queryInterface.sequelize.query('CREATE INDEX authorization_records_workspace_id_idx ON authorization_records(workspace_id);');
};

exports.down = async (queryInterface: any) => {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS authorization_records;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS order_items;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS orders;');
};
