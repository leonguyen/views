// DB.js - A unified database interface for migrations and queries
// Combines a Laravel-like migration system with a fluent query builder for Supabase.

// =====================================================================
// IMPORTANT: Configure your Supabase project details here
// =====================================================================
import config from './db.json';

const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_KEY = config.supabaseKey;

// A simple utility to make HTTP requests
class Request {
  static async post(url, body, options = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: options.headers,
      body: body,
    });
    return response.text();
  }
}

// --------------------------------------------------------------------
// SchemaBuilder & Schema (From Migration.js)
// --------------------------------------------------------------------
/**
 * @class SchemaBuilder
 * @description Constructs SQL for creating database tables.
 */
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

/**
 * @class Schema
 * @description Manages database schema operations like creating and dropping tables.
 */
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

// --------------------------------------------------------------------
// QueryBuilder (From QueryBuilder.js)
// --------------------------------------------------------------------
/**
 * @class QueryBuilder
 * @description A fluent query builder for the Supabase REST API.
 * Mimics the syntax and chaining of the Laravel Query Builder.
 */
class QueryBuilder {
  constructor() {
    this.baseUrl = SUPABASE_URL;
    this.apiKey = SUPABASE_KEY;
    this.path = '';
    this.query = {};
    this.body = null;
    this.method = 'GET';
    this.filters = [];
  }

  from(table) {
    this.path = `/${table}`;
    return this;
  }

  where(column, operator, value) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }

    const supabaseOperator = this._mapOperator(operator);
    this.filters.push(`${column}.${supabaseOperator}.${value}`);
    return this;
  }

  orWhere(column, operator, value) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }
    const supabaseOperator = this._mapOperator(operator);
    const filterString = `${column}.${supabaseOperator}.${value}`;
    if (this.query.or) {
      this.query.or += `,${filterString}`;
    } else {
      this.query.or = filterString;
    }
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  offset(count) {
    this.query.offset = count;
    return this;
  }

  select(...columns) {
    this.method = 'GET';
    this.query.select = columns.join(',');
    return this;
  }

  insert(data) {
    this.method = 'POST';
    this.body = JSON.stringify(data);
    return this;
  }

  update(data) {
    this.method = 'PATCH';
    this.body = JSON.stringify(data);
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  async get() {
    this._applyFilters();
    const url = new URL(`${this.baseUrl}/rest/v1${this.path}`);
    Object.keys(this.query).forEach(key => url.searchParams.append(key, this.query[key]));

    const options = {
      method: this.method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: this.body,
    };

    try {
      const response = await fetch(url.toString(), options);
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  _mapOperator(operator) {
    switch (operator) {
      case '=':
      case '==':
        return 'eq';
      case '>':
        return 'gt';
      case '>=':
        return 'gte';
      case '<':
        return 'lt';
      case '<=':
        return 'lte';
      case '!=':
      case '<>':
        return 'neq';
      case 'in':
        return 'in';
      case 'like':
        return 'like';
      default:
        return 'eq';
    }
  }

  _applyFilters() {
    if (this.filters.length > 0) {
      if (this.query.or) {
        const andFilters = this.filters.join(',');
        this.query.or = `and(${andFilters}),${this.query.or}`;
      } else {
        this.filters.forEach(filter => {
          const [column, ...rest] = filter.split('.');
          const value = rest.join('.');
          if (this.query[column]) {
            this.query[column] += `,${value}`;
          } else {
            this.query[column] = value;
          }
        });
      }
    }
  }
}

// --------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------
const DB = {
  /**
   * Fluent query builder interface.
   * @param {string} table The table name.
   * @returns {QueryBuilder}
   */
  table: (table) => {
    return new QueryBuilder().from(table);
  },

  /**
   * Alias for DB.table() to match Laravel's `DB::from()`.
   * @param {string} table The table name.
   * @returns {QueryBuilder}
   */
  from: (table) => {
    return DB.table(table);
  },

  /**
   * Exposes the Schema for migration operations.
   */
  Schema: Schema,
};

// Export the unified DB object for use in other files.
// For example: `import DB from './DB.js';`
export default DB;
