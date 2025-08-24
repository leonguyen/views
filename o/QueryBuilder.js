// Request.js - A Supabase Query Builder with Laravel-like syntax

// =====================================================================
// IMPORTANT: Configure your Supabase project details here
// =====================================================================
const SUPABASE_URL = 'https://clqvkzwoxlanhjhnmids.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscXZrendveGxhbmhqaG5taWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTIwNjMsImV4cCI6MjA2OTc4ODA2M30.0K-WhKR-j0n8pYX6KeIVQWoPXRsQad_8vptiKEGHMSo';
const supabase = new SupabaseQueryBuilder(SUPABASE_URL, SUPABASE_KEY);


/**
 * @class SupabaseQueryBuilder
 * @description A fluent query builder for the Supabase REST API.
 * Mimics the syntax and chaining of the Laravel Query Builder.
 */
class SupabaseQueryBuilder {
  constructor(baseUrl, apiKey) {
    if (!baseUrl || !apiKey) {
      throw new Error('Supabase URL and API Key are required.');
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.path = '';
    this.query = {};
    this.body = null;
    this.method = 'GET';
    this.filters = [];
  }

  /**
   * Sets the table to query. Corresponds to Laravel's `DB::table('table_name')`.
   * @param {string} table - The name of the table.
   * @returns {SupabaseQueryBuilder}
   */
  from(table) {
    this.path = `/${table}`;
    return this;
  }

  /**
   * Adds a WHERE clause to the query.
   * @param {string} column - The column name.
   * @param {string} [operator='='] - The comparison operator.
   * @param {*} value - The value to compare against.
   * @returns {SupabaseQueryBuilder}
   */
  where(column, operator, value) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }

    const supabaseOperator = this._mapOperator(operator);
    this.filters.push(`${column}.${supabaseOperator}.${value}`);
    return this;
  }

  /**
   * Adds an OR WHERE clause.
   * @param {string} column - The column name.
   * @param {string} [operator='='] - The comparison operator.
   * @param {*} value - The value to compare against.
   * @returns {SupabaseQueryBuilder}
   */
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

  /**
   * Sets the number of results to limit. Corresponds to Laravel's `limit()`.
   * @param {number} count - The number of records to return.
   * @returns {SupabaseQueryBuilder}
   */
  limit(count) {
    this.query.limit = count;
    return this;
  }

  /**
   * Sets the starting offset for the results. Corresponds to Laravel's `offset()`.
   * @param {number} count - The number of records to skip.
   * @returns {SupabaseQueryBuilder}
   */
  offset(count) {
    this.query.offset = count;
    return this;
  }

  /**
   * Selects specific columns. Corresponds to Laravel's `select()`.
   * @param {...string} columns - The columns to retrieve.
   * @returns {SupabaseQueryBuilder}
   */
  select(...columns) {
    this.method = 'GET';
    this.query.select = columns.join(',');
    return this;
  }

  /**
   * Inserts data into the table. Corresponds to Laravel's `insert()`.
   * @param {object} data - The data to insert.
   * @returns {SupabaseQueryBuilder}
   */
  insert(data) {
    this.method = 'POST';
    this.body = JSON.stringify(data);
    return this;
  }

  /**
   * Updates data in the table. Corresponds to Laravel's `update()`.
   * @param {object} data - The data to update.
   * @returns {SupabaseQueryBuilder}
   */
  update(data) {
    this.method = 'PATCH';
    this.body = JSON.stringify(data);
    return this;
  }

  /**
   * Deletes data from the table. Corresponds to Laravel's `delete()`.
   * @returns {SupabaseQueryBuilder}
   */
  delete() {
    this.method = 'DELETE';
    return this;
  }

  /**
   * Final method to execute the query and retrieve the results.
   * Corresponds to Laravel's `get()`.
   * @returns {Promise<{ data: any, error: any }>}
   */
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
        return 'in'; // Note: This needs proper array handling
      case 'like':
        return 'like';
      default:
        return 'eq';
    }
  }

  _applyFilters() {
    // If there are simple `where` filters, combine them
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
/*
// =====================================================================
// USAGE EXAMPLES
// =====================================================================

// --- SELECT a single user with id = 1 and specific columns ---
async function getUserById() {
  const { data, error } = await supabase.from('users')
    .select('id', 'name', 'email')
    .where('id', 1)
    .get();

  if (error) {
    console.error('Error fetching user:', error);
  } else {
    console.log('User fetched:', data);
  }
}

// --- SELECT all users with a specific name, and limit to 5 results ---
async function getUsersByName() {
  const { data, error } = await supabase.from('users')
    .where('name', 'like', 'John%')
    .limit(5)
    .get();

  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Users fetched:', data);
  }
}

// --- INSERT a new record ---
async function insertNewPost() {
  const newPost = { title: 'My new post', content: 'This is the content of my post.' };
  const { data, error } = await supabase.from('posts')
    .insert(newPost)
    .get();

  if (error) {
    console.error('Error inserting post:', error);
  } else {
    console.log('Post inserted:', data);
  }
}

// --- UPDATE a record with id = 1 ---
async function updatePost() {
  const updatedData = { content: 'This is the updated content.' };
  const { data, error } = await supabase.from('posts')
    .where('id', 1)
    .update(updatedData)
    .get();

  if (error) {
    console.error('Error updating post:', error);
  } else {
    console.log('Post updated:', data);
  }
}

// --- DELETE a record with id = 1 ---
async function deletePost() {
  const { data, error } = await supabase.from('posts')
    .where('id', 1)
    .delete()
    .get();

  if (error) {
    console.error('Error deleting post:', error);
  } else {
    console.log('Post deleted:', data);
  }
}

// You can call these functions to test the builder.
// For example:
// getUserById();
// insertNewPost();
*/