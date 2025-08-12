// LocalStorage.js - Refactored, safer and consistent interface for browser localStorage

class LocalStorage {
  /**
   * @param {string} key - default key namespace used by instance
   */
  constructor(key = '') {
    this.key = String(key || '');
  }

  // --- Internal helpers ---
  _getKey(key = '') {
    return (key && String(key)) || this.key;
  }

  _safeParse(jsonStr) {
    try {
      return jsonStr ? JSON.parse(jsonStr) : [];
    } catch (e) {
      console.error('LocalStorage: invalid JSON stored at key', e);
      return [];
    }
  }

  _safeStringify(value) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.error('LocalStorage: could not stringify value', e);
      return '[]';
    }
  }

  // --- Core API (consistent naming, chainable where appropriate) ---

  /**
   * Get all items as array. If stored value isn't array, returns [].
   * @param {string} [keyOverride]
   * @returns {Array}
   */
  getAll(keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) return [];
    const raw = localStorage.getItem(k);
    const parsed = this._safeParse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }

  /**
   * Save an array to storage under provided key or instance key.
   * @param {Array} dataArray
   * @param {string} [keyOverride]
   * @returns {LocalStorage} this
   */
  saveAll(dataArray = [], keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) {
      console.warn('LocalStorage.saveAll: no key specified');
      return this;
    }
    if (!Array.isArray(dataArray)) {
      console.warn('LocalStorage.saveAll: provided data is not an array — saving empty array instead');
      dataArray = [];
    }
    try {
      localStorage.setItem(k, this._safeStringify(dataArray));
    } catch (e) {
      console.error('LocalStorage.saveAll error:', e);
    }
    return this;
  }

  /**
   * Add an item (push) to stored array
   * @param {*} item
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  add(item, keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) {
      console.warn('LocalStorage.add: no key specified');
      return this;
    }
    const list = this.getAll(k);
    list.push(item);
    this.saveAll(list, k);
    return this;
  }

  /**
   * Remove item by index (if valid)
   * @param {number} index
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  remove(index, keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) return this;
    const list = this.getAll(k);
    if (index < 0 || index >= list.length) {
      console.warn(`LocalStorage.remove: index ${index} out of bounds`);
      return this;
    }
    list.splice(index, 1);
    this.saveAll(list, k);
    return this;
  }

  /**
   * Remove item at index (alias for remove)
   * @param {number} index
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  removeAt(index, keyOverride = '') {
    return this.remove(index, keyOverride);
  }

  /**
   * Clear entire stored array at key
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  clear(keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) return this;
    localStorage.removeItem(k);
    return this;
  }

  /**
   * Get first item or null
   * @param {string} [keyOverride]
   * @returns {*|null}
   */
  first(keyOverride = '') {
    const arr = this.getAll(keyOverride);
    return arr.length > 0 ? arr[0] : null;
  }

  /**
   * Get last item or null
   * @param {string} [keyOverride]
   * @returns {*|null}
   */
  last(keyOverride = '') {
    const arr = this.getAll(keyOverride);
    return arr.length > 0 ? arr[arr.length - 1] : null;
  }

  /**
   * Static convenience: return last item for a given key (without creating instance)
   * @param {string} key
   * @returns {*|null}
   */
  static last(key = '') {
    return new LocalStorage(key).last();
  }

  /**
   * Get item at index or null
   * @param {number} index
   * @param {string} [keyOverride]
   * @returns {*|null}
   */
  at(index = 0, keyOverride = '') {
    const arr = this.getAll(keyOverride);
    return index >= 0 && index < arr.length ? arr[index] : null;
  }

  /**
   * Replace item at index
   * @param {number} index
   * @param {*} newItem
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  setAt(index = 0, newItem, keyOverride = '') {
    const k = this._getKey(keyOverride);
    if (!k) return this;
    const arr = this.getAll(k);
    if (index < 0 || index >= arr.length) {
      console.warn(`LocalStorage.setAt: index ${index} out of bounds`);
      return this;
    }
    arr[index] = newItem;
    this.saveAll(arr, k);
    return this;
  }

  /**
   * Replace stored array entirely (alias for saveAll)
   * @param {Array} dataArray
   * @param {string} [keyOverride]
   * @returns {LocalStorage}
   */
  replaceAll(dataArray = [], keyOverride = '') {
    return this.saveAll(dataArray, keyOverride);
  }
}

// --- Supabase helper namespace (kept, refactored) ---
LocalStorage.supabase = {
  getSupabaseConfig() {
    return {
      url: localStorage.getItem('SUPABASE_URL') || '',
      key: localStorage.getItem('SUPABASE_KEY') || ''
    };
  },

  saveSupabaseConfig(url = '', key = '') {
    if (url != null) localStorage.setItem('SUPABASE_URL', String(url));
    if (key != null) localStorage.setItem('SUPABASE_KEY', String(key));
  },

  resetSupabaseConfig() {
    localStorage.removeItem('SUPABASE_URL');
    localStorage.removeItem('SUPABASE_KEY');
  },

  hasSupabaseConfig() {
    return !!localStorage.getItem('SUPABASE_URL') && !!localStorage.getItem('SUPABASE_KEY');
  }
};

// Attach to window for backward compatibility if desired
window.LocalStorage = LocalStorage;
