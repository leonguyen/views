/* UniversalStorage.js
 * A tiny client-side ORM for IndexedDB or LocalStorage with:
 * - Chainable Query Builder (where/orWhere/whereIn/whereBetween/whereNull/orderBy/limit/paginate)
 * - CRUD + helpers (first/findById/count/exists/distinct/pluck)
 * - Aggregates (sum/avg/min/max)
 * - Bulk mutations (updateWhere/deleteWhere) honoring current filters
 * - Cross-store JOIN (inner/left)
 * - SQL-like parser: SELECT / UPDATE / DELETE (AND/OR, IN, BETWEEN, LIKE, IS NULL/NOT NULL, ORDER BY, LIMIT)
 */

export class UniversalStorage {
  constructor({
    backend = 'indexeddb', // 'indexeddb' | 'localstorage'
    dbName = 'UniversalDB',
    storeName = 'DefaultStore',
    idKey = 'id',          // primary key field
    version = 1,           // IndexedDB version
  } = {}) {
    this.backend = backend.toLowerCase();
    this.dbName = dbName;
    this.storeName = storeName;
    this.idKey = idKey;
    this.version = version;
    this.db = null;

    // Query state
    this._resetQueryState();
  }

  async init(schemaUpgrade /* optional: (db, oldVersion, newVersion) => void */) {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(this.dbName, this.version);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: this.idKey, autoIncrement: true });
          }
          if (typeof schemaUpgrade === 'function') {
            schemaUpgrade(db, e.oldVersion, e.newVersion);
          }
        };
        req.onsuccess = (e) => { this.db = e.target.result; resolve(true); };
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      // Ensure an array exists for this store in LocalStorage mode (array layout for speed)
      if (!localStorage.getItem(this._lsKey())) localStorage.setItem(this._lsKey(), '[]');
      return true;
    }
  }

  // ---------- Query Builder ----------
  where(field, operator, value) {
    this.filters.push({ kind: 'and', field, operator: operator.toUpperCase(), value });
    return this;
  }

  orWhere(field, operator, value) {
    this.filters.push({ kind: 'or', field, operator: operator.toUpperCase(), value });
    return this;
  }

  whereIn(field, arr) {
    this.filters.push({ kind: 'and', field, operator: 'IN', value: arr });
    return this;
  }

  whereBetween(field, min, max) {
    this.filters.push({ kind: 'and', field, operator: 'BETWEEN', value: [min, max] });
    return this;
  }

  whereNull(field) {
    this.filters.push({ kind: 'and', field, operator: 'IS NULL', value: null });
    return this;
  }

  whereNotNull(field) {
    this.filters.push({ kind: 'and', field, operator: 'IS NOT NULL', value: null });
    return this;
  }

  orderBy(field, direction = 'asc') {
    this.sortField = field;
    this.sortDirection = (direction || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    return this;
  }

  limit(count) {
    this.limitCount = Number(count);
    return this;
  }

  paginate(page, perPage) {
    this.pageNumber = Math.max(1, Number(page) || 1);
    this.perPageCount = Math.max(1, Number(perPage) || 10);
    return this;
  }

  // ---------- CRUD ----------
  async insert(data) {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).add(data);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    } else {
      const items = this._lsAll();
      const nextId = this._nextLocalId(items);
      items.push({ ...data, [this.idKey]: nextId });
      this._lsSetAll(items);
      return true;
    }
  }

  async update(id, data) {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).put({ ...data, [this.idKey]: id });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    } else {
      const items = this._lsAll();
      const idx = items.findIndex(it => it[this.idKey] === id);
      if (idx === -1) return false;
      items[idx] = { ...items[idx], ...data, [this.idKey]: id };
      this._lsSetAll(items);
      return true;
    }
  }

  async delete(id) {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    } else {
      const items = this._lsAll().filter(it => it[this.idKey] !== id);
      this._lsSetAll(items);
      return true;
    }
  }

  async clear() {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    } else {
      this._lsSetAll([]);
      return true;
    }
  }

  // ---------- Reads ----------
  async get() {
    const all = await this._fetchAll();
    let results = this._applyWhere([...all], this.filters);

    // Sort
    if (this.sortField) {
      const dir = this.sortDirection === 'desc' ? -1 : 1;
      results.sort((a, b) => (a?.[this.sortField] < b?.[this.sortField] ? -1 : a?.[this.sortField] > b?.[this.sortField] ? 1 : 0) * dir);
    }

    // Pagination
    if (this.pageNumber != null && this.perPageCount != null) {
      const start = (this.pageNumber - 1) * this.perPageCount;
      results = results.slice(start, start + this.perPageCount);
    }

    // Limit
    if (this.limitCount != null) {
      results = results.slice(0, this.limitCount);
    }

    this._resetQueryState();
    return results;
  }

  async first() {
    return (await this.limit(1).get())[0] ?? null;
  }

  async findById(id) {
    const all = await this._fetchAll();
    return all.find(it => it[this.idKey] === id) || null;
  }

  async count() {
    const data = await this.get();
    return data.length;
  }

  async exists() {
    return (await this.limit(1).get()).length > 0;
  }

  async pluck(field) {
    const data = await this.get();
    return data.map(r => r?.[field]);
  }

  async distinct(field) {
    const data = await this.get();
    return [...new Set(data.map(r => r?.[field]))];
  }

  // ---------- Aggregates ----------
  async sum(field) {
    const data = await this.get();
    return data.reduce((acc, r) => acc + (Number(r?.[field]) || 0), 0);
  }
  async avg(field) {
    const data = await this.get();
    return data.length ? (await this.sum(field)) / data.length : 0;
  }
  async min(field) {
    const data = await this.get();
    if (!data.length) return null;
    return data.reduce((m, r) => (m == null || r?.[field] < m ? r?.[field] : m), null);
  }
  async max(field) {
    const data = await this.get();
    if (!data.length) return null;
    return data.reduce((m, r) => (m == null || r?.[field] > m ? r?.[field] : m), null);
  }

  // ---------- Bulk mutations honoring current filters ----------
  async updateWhere(patch) {
    const snapshot = this._snapshotQuery();
    const all = await this._fetchAll();
    const targets = this._applyWhere(all, snapshot.filters);
    for (const rec of targets) {
      await this.update(rec[this.idKey], { ...rec, ...patch });
    }
    this._restoreQuery(snapshot); // keep builder usable after
    return true;
  }

  async deleteWhere() {
    const snapshot = this._snapshotQuery();
    const all = await this._fetchAll();
    const targets = this._applyWhere(all, snapshot.filters);
    for (const rec of targets) {
      await this.delete(rec[this.idKey]);
    }
    this._restoreQuery(snapshot);
    return true;
  }

  // ---------- JOIN (in-memory) ----------
  /**
   * join(otherStore, localField, foreignField, options)
   *  - type: 'inner' | 'left'  (default 'inner')
   *  - select: (a, b) => joinedRecord   // how to shape joined rows
   *  - aliasA / aliasB: optional field prefixes to avoid collisions
   */
  async join(otherStore, localField, foreignField, {
    type = 'inner',
    select = (a, b) => ({ ...a, ...b }),
    aliasA,
    aliasB,
  } = {}) {
    // Get current filtered left rows (without resetting state)
    const leftSnapshot = this._snapshotQuery();
    const leftAll = await this._fetchAll();
    const leftRows = this._applyWhere(leftAll, leftSnapshot.filters);
    // Right rows: everything from other store (apply its current filters if any)
    const rightSnapshot = otherStore._snapshotQuery();
    const rightAll = await otherStore._fetchAll();
    const rightRows = otherStore._applyWhere(rightAll, rightSnapshot.filters);

    // Build hash for right by foreignField
    const map = new Map();
    for (const r of rightRows) {
      const k = r?.[foreignField];
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    }

    const out = [];
    for (const a of leftRows) {
      const matches = map.get(a?.[localField]) || [];
      if (matches.length) {
        for (const b of matches) {
          const shaped = select(
            aliasA ? this._withPrefix(a, aliasA) : a,
            aliasB ? this._withPrefix(b, aliasB) : b
          );
        out.push(shaped);
        }
      } else if (type === 'left') {
        out.push(select(aliasA ? this._withPrefix(a, aliasA) : a, null));
      }
    }

    // Apply order/limit/pagination from the *left* builder
    let results = out;
    if (leftSnapshot.sortField) {
      const dir = leftSnapshot.sortDirection === 'desc' ? -1 : 1;
      results.sort((x, y) => (x?.[leftSnapshot.sortField] < y?.[leftSnapshot.sortField] ? -1 : x?.[leftSnapshot.sortField] > y?.[leftSnapshot.sortField] ? 1 : 0) * dir);
    }
    if (leftSnapshot.pageNumber != null && leftSnapshot.perPageCount != null) {
      const start = (leftSnapshot.pageNumber - 1) * leftSnapshot.perPageCount;
      results = results.slice(start, start + leftSnapshot.perPageCount);
    }
    if (leftSnapshot.limitCount != null) {
      results = results.slice(0, leftSnapshot.limitCount);
    }

    // Do not mutate either store's query states
    this._restoreQuery(leftSnapshot);
    otherStore._restoreQuery(rightSnapshot);

    // After a join, we return a lightweight wrapper that supports .get()-like behavior immediately.
    return {
      toArray: () => results,
      first: () => results[0] || null,
      count: () => results.length,
    };
  }

  // ---------- SQL-like parsing ----------
  /**
   * SELECT * FROM store WHERE ... ORDER BY field [ASC|DESC] LIMIT n;
   * UPDATE store SET field='value', age=30 WHERE ...;
   * DELETE FROM store WHERE ...;
   * Supported operators: =, !=, >, <, >=, <=, LIKE, IN(...), BETWEEN a AND b, IS NULL, IS NOT NULL
   * Supports AND / OR (OR is left-associative at top level)
   */
  async sql(command) {
    const sql = command.trim().replace(/\s+/g, ' ');
    const up = sql.toUpperCase();

    if (up.startsWith('SELECT')) return this._sqlSelect(sql);
    if (up.startsWith('UPDATE')) return this._sqlUpdate(sql);
    if (up.startsWith('DELETE')) return this._sqlDelete(sql);

    throw new Error('Unsupported SQL command. Use SELECT/UPDATE/DELETE.');
  }

  async _sqlSelect(sql) {
    // WHERE
    const whereStr = this._slice(sql, / WHERE /i, /( ORDER BY | LIMIT |;|$)/i);
    if (whereStr) this._parseWhere(whereStr);

    // ORDER BY
    const orderStr = this._slice(sql, / ORDER BY /i, /( LIMIT |;|$)/i);
    if (orderStr) {
      const m = orderStr.match(/^\s*([A-Za-z0-9_.$]+)\s*(ASC|DESC)?\s*$/i);
      if (m) this.orderBy(m[1], (m[2] || 'asc').toLowerCase());
    }

    // LIMIT
    const limitStr = this._slice(sql, / LIMIT /i, /( ;|$)/i);
    if (limitStr) {
      const m = limitStr.match(/^\s*(\d+)\s*$/);
      if (m) this.limit(Number(m[1]));
    }

    return this.get();
  }

  async _sqlUpdate(sql) {
    // SET clause
    const setStr = this._slice(sql, / SET /i, / WHERE /i) || this._slice(sql, / SET /i, /( ;|$)/i);
    if (!setStr) throw new Error('UPDATE requires SET clause.');
    const patch = {};
    for (const part of setStr.split(',')) {
      const m = part.trim().match(/^([A-Za-z0-9_.$]+)\s*=\s*(.+)$/);
      if (!m) continue;
      const key = m[1];
      const rawVal = m[2].trim();
      patch[key] = this._parseValue(rawVal);
    }

    // WHERE (optional)
    const whereStr = this._slice(sql, / WHERE /i, /( ;|$)/i);
    if (whereStr) this._parseWhere(whereStr);

    await this.updateWhere(patch);
    return true;
  }

  async _sqlDelete(sql) {
    const whereStr = this._slice(sql, / WHERE /i, /( ;|$)/i);
    if (whereStr) this._parseWhere(whereStr);
    await this.deleteWhere();
    return true;
  }

  // ---------- Internals ----------
  _applyWhere(rows, filters) {
    if (!filters.length) return rows;

    return rows.filter(row => {
      let andOK = true;
      let orOK = false;
      for (const f of filters) {
        const passed = this._match(row, f.field, f.operator, f.value);
        if (f.kind === 'and') andOK = andOK && passed;
        else if (f.kind === 'or') orOK = orOK || passed;
      }
      return (andOK || orOK);
    });
  }

  _match(obj, field, operator, value) {
    const v = obj?.[field];
    switch (operator) {
      case '=': return v === value;
      case '!=': return v !== value;
      case '>': return v > value;
      case '<': return v < value;
      case '>=': return v >= value;
      case '<=': return v <= value;
      case 'LIKE': return String(v ?? '').includes(String(value ?? ''));
      case 'IN': return Array.isArray(value) && value.includes(v);
      case 'BETWEEN': return v >= value[0] && v <= value[1];
      case 'IS NULL': return v == null;
      case 'IS NOT NULL': return v != null;
      default: return true;
    }
  }

  // SQL helpers
  _slice(sql, startRegex, endRegex) {
    const start = sql.search(startRegex);
    if (start === -1) return '';
    const tail = sql.slice(start + sql.match(startRegex)[0].length);
    const end = tail.search(endRegex);
    return end === -1 ? tail.trim() : tail.slice(0, end).trim();
  }

  _parseWhere(whereStr) {
    // Split on OR at top level
    const orParts = whereStr.split(/\s+OR\s+/i);
    for (let i = 0; i < orParts.length; i++) {
      const andParts = orParts[i].split(/\s+AND\s+/i);
      for (const cond of andParts) {
        const parsed = this._parseCondition(cond.trim());
        if (!parsed) continue;
        const { field, operator, value } = parsed;
        if (i === 0) this.where(field, operator, value);
        else this.orWhere(field, operator, value);
      }
    }
  }

  _parseCondition(cond) {
    // IN (...)
    let m = cond.match(/^([A-Za-z0-9_.$]+)\s+IN\s*\((.+)\)$/i);
    if (m) {
      const field = m[1];
      const arr = m[2].split(',').map(s => this._parseValue(s.trim()));
      return { field, operator: 'IN', value: arr };
    }
    // BETWEEN a AND b
    m = cond.match(/^([A-Za-z0-9_.$]+)\s+BETWEEN\s+(.+)\s+AND\s+(.+)$/i);
    if (m) {
      const field = m[1];
      const a = this._parseValue(m[2].trim());
      const b = this._parseValue(m[3].trim());
      return { field, operator: 'BETWEEN', value: [a, b] };
    }
    // IS NULL / IS NOT NULL
    m = cond.match(/^([A-Za-z0-9_.$]+)\s+IS\s+(NOT\s+)?NULL$/i);
    if (m) {
      const field = m[1];
      const not = !!m[2];
      return { field, operator: not ? 'IS NOT NULL' : 'IS NULL', value: null };
    }
    // Standard binary ops inc. LIKE
    m = cond.match(/^([A-Za-z0-0_.$]+)\s*(=|!=|>=|<=|>|<|LIKE)\s*(.+)$/i);
    if (m) {
      const field = m[1];
      const op = m[2].toUpperCase();
      const value = this._parseValue(m[3].trim());
      return { field, operator: op, value };
    }
    return null;
  }

  _parseValue(token) {
    // Strip quotes if any
    if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith('"') && token.endsWith('"'))) {
      return token.slice(1, -1);
    }
    // Numeric?
    if (!isNaN(token)) return Number(token);
    // NULL literal
    if (/^NULL$/i.test(token)) return null;
    // TRUE/FALSE
    if (/^TRUE$/i.test(token)) return true;
    if (/^FALSE$/i.test(token)) return false;
    // Fallback string
    return token;
  }

  _withPrefix(obj, prefix) {
    if (!obj) return obj;
    const out = {};
    for (const k of Object.keys(obj)) out[`${prefix}.${k}`] = obj[k];
    return out;
  }

  _snapshotQuery() {
    return {
      filters: this.filters.map(f => ({ ...f })),
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      limitCount: this.limitCount,
      pageNumber: this.pageNumber,
      perPageCount: this.perPageCount,
    };
  }
  _restoreQuery(s) {
    this.filters = s.filters.map(f => ({ ...f }));
    this.sortField = s.sortField;
    this.sortDirection = s.sortDirection;
    this.limitCount = s.limitCount;
    this.pageNumber = s.pageNumber;
    this.perPageCount = s.perPageCount;
  }
  _resetQueryState() {
    this.filters = [];
    this.sortField = null;
    this.sortDirection = 'asc';
    this.limitCount = null;
    this.pageNumber = null;
    this.perPageCount = null;
  }

  // Backend utils
  async _fetchAll() {
    if (this.backend === 'indexeddb') {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const req = tx.objectStore(this.storeName).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      return this._lsAll();
    }
  }

  _lsKey() { return `${this.dbName}:${this.storeName}`; }
  _lsAll() { return JSON.parse(localStorage.getItem(this._lsKey()) || '[]'); }
  _lsSetAll(arr) { localStorage.setItem(this._lsKey(), JSON.stringify(arr)); }
  _nextLocalId(items) {
    // numeric autoincrement convenience
    const max = items.reduce((m, r) => Math.max(m, Number(r?.[this.idKey]) || 0), 0);
    return max + 1;
  }
}

/* Convenience factory */
export async function storage(opts) {
  const s = new UniversalStorage(opts);
  await s.init(opts?.schemaUpgrade);
  return s;
}
