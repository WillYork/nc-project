exports.up = knex => {
    return knex.schema.createTable("articles", articlesTable => {
      articlesTable.increments("article_id").primary();
      articlesTable.string("title").notNullable();
      articlesTable.string("body").notNullable();
      articlesTable.integer("votes").defaultTo(0);
      articlesTable.string("topic").notNullable().references("topics.slug");
      articlesTable.string("author").notNullable().references("users.username");
      articlesTable.timestamp("created_at");
    });
  };
  
  exports.down = knex => {
    return knex.schema.dropTable("articles");
  };