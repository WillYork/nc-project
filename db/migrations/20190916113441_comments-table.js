exports.up = knex => {
    return knex.schema.createTable("comments", commentsTable => {
      commentsTable.increments("comment_id").primary();
      commentsTable.string("author").notNullable().references("users.username");
      commentsTable.integer("article_id").notNullable().references("articles.article_id");
      commentsTable.integer("votes").defaultTo(0);
      commentsTable.timestamp("created_at");
      commentsTable.string("body").notNullable();
    });
  };
  
  exports.down = knex => {
    return knex.schema.dropTable("comments");
  };