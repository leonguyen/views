// Migration.js - Laravel-like migration system for Supabase
class SchemaBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.columns = [];
  }

  increments(column) {
    this.columns.push(`${column} SERIAL PRIMARY KEY`);
    return this;
  }

  string(column, length = 255) {
    this.columns.push(`${column} VARCHAR(${length})`);
    return this;
  }

  integer(column) {
    this.columns.push(`${column} INTEGER`);
    return this;
  }

  boolean(column) {
    this.columns.push(`${column} BOOLEAN`);
    return this;
  }

  text(column) {
    this.columns.push(`${column} TEXT`);
    return this;
  }

  timestamps() {
    this.columns.push(`created_at TIMESTAMP DEFAULT NOW()`);
    this.columns.push(`updated_at TIMESTAMP DEFAULT NOW()`);
    return this;
  }

  unique(column) {
    this.columns.push(`UNIQUE (${column})`);
    return this;
  }

  getSQLCreate() {
    return `CREATE TABLE IF NOT EXISTS ${this.tableName} (${this.columns.join(', ')});`;
  }

  getSQLDrop() {
    return `DROP TABLE IF EXISTS ${this.tableName};`;
  }
}

class Schema {
  static create(tableName, callback) {
    const builder = new SchemaBuilder(tableName);
    callback(builder);
    const sql = builder.getSQLCreate();
    return Schema._execute(sql);
  }

  static drop(tableName) {
    const builder = new SchemaBuilder(tableName);
    const sql = builder.getSQLDrop();
    return Schema._execute(sql);
  }

  static async _execute(sql) {
    const url = `${SUPABASE_URL}/rest/v1/rpc/execute_sql`;
    const body = JSON.stringify({ sql });

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await Request.post(url, body, { headers });
      return JSON.parse(response);
    } catch (error) {
      console.error('Migration Error:', error);
      return null;
    }
  }
}

// Usage Example
/*
Schema.create('users', (table) => {
  table.increments('id');
  table.string('name');
  table.string('email');
  table.timestamps();
});

Schema.drop('users');
*/

