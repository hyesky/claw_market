exports.up = async (queryInterface: any) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS soul_products (
      id CHAR(36) PRIMARY KEY,
      creator_id CHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      agent_type VARCHAR(50),
      model_compatibility TEXT,
      personality_tags TEXT,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      currency VARCHAR(10) NOT NULL DEFAULT 'CNY',
      status ENUM('draft', 'published', 'archived', 'rejected') NOT NULL DEFAULT 'draft',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS soul_versions (
      id CHAR(36) PRIMARY KEY,
      product_id CHAR(36) NOT NULL,
      version VARCHAR(20) NOT NULL,
      file_content TEXT NOT NULL,
      is_latest TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY unique_product_version (product_id, version)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS soul_bundles (
      id CHAR(36) PRIMARY KEY,
      product_id CHAR(36) NOT NULL,
      version_id CHAR(36) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(50) NOT NULL,
      file_content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES soul_products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (version_id) REFERENCES soul_versions(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await queryInterface.sequelize.query('CREATE INDEX soul_products_slug_idx ON soul_products(slug);');
  await queryInterface.sequelize.query('CREATE INDEX soul_products_creator_status_idx ON soul_products(creator_id, status);');
  await queryInterface.sequelize.query('CREATE INDEX soul_versions_product_id_idx ON soul_versions(product_id);');
  await queryInterface.sequelize.query('CREATE INDEX soul_bundles_product_version_idx ON soul_bundles(product_id, version_id);');
};

exports.down = async (queryInterface: any) => {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS soul_bundles;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS soul_versions;');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS soul_products;');
};
