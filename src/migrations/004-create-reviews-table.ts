exports.up = async (queryInterface: any) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id CHAR(36) PRIMARY KEY,
      product_id CHAR(36) NOT NULL,
      buyer_id CHAR(36) NOT NULL,
      rating INT NOT NULL,
      comment TEXT,
      images TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CHECK (rating >= 1 AND rating <= 5)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id CHAR(36) PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      user_id CHAR(36),
      target_type VARCHAR(50),
      target_id CHAR(36),
      details JSON,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS content_moderation (
      id CHAR(36) PRIMARY KEY,
      product_id CHAR(36),
      version_id CHAR(36),
      status ENUM('pending', 'approved', 'rejected', 'flagged') NOT NULL DEFAULT 'pending',
      reason TEXT,
      moderator_id CHAR(36),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY (version_id) REFERENCES soul_versions(id) ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query('CREATE INDEX reviews_product_id_idx ON reviews(product_id);');
  await queryInterface.sequelize.query('CREATE INDEX reviews_buyer_id_idx ON reviews(buyer_id);');
  await queryInterface.sequelize.query('CREATE INDEX reviews_rating_idx ON reviews(rating);');
  await queryInterface.sequelize.query('CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);');
  await queryInterface.sequelize.query('CREATE INDEX audit_logs_action_idx ON audit_logs(action);');
  await queryInterface.sequelize.query('CREATE INDEX audit_logs_created_at_idx ON audit_logs(created_at);');
  await queryInterface.sequelize.query('CREATE INDEX content_moderation_product_id_idx ON content_moderation(product_id);');
  await queryInterface.sequelize.query('CREATE INDEX content_moderation_status_idx ON content_moderation(status);');
};

exports.down = async (queryInterface: any) => {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS content_moderation;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS audit_logs;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS reviews;');
};
