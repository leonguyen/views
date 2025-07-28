class LocalStorage {
    constructor(key) {
        this.key = key;
    }
    getAll(key = "") {
        if (key && key.length > 0) this.key = key;
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Invalid JSON in localStorage:", e);
            return [];
        }
    }
    _saveAll(key = "", dataArray = "") {
        if (key && key.length > 0) this.key = key;
        if (!Array.isArray(dataArray)) {
            dataArray = []; // ENSURE VALID ARRAY
            localStorage.removeItem(this.key);
        }
        localStorage.setItem(this.key, JSON.stringify(dataArray));
    }
    saveAll(dataArray = "", key = "") {
        this._saveAll(this.key, dataArray);
    }
    _add(item) {
        const list = this.getAll();
        list.push(item);
        this._saveAll(this.key, list);
    }
    add(item) {
        this._add(item);
    }
    remove(index) {
        const list = this.getAll();
        list.splice(index, 1);
        this.saveAll(list);
    }
    removeAt(index) {
        const all = this.getAll();
        all.splice(index, 1);
        localStorage.setItem(this.namespace, JSON.stringify(all));
    }
    // New Function: Get First Item
    first() {
        const list = this.getAll();
        return list.length > 0 ? list[0] : null; // Return first item or null if empty
    }
    // New Function: Get Last Item
    last(key = "") {
        const list = this.getAll(key);
        return list.length > 0 ? list[list.length - 1] : null; // Return last item or null if empty
    }
    static last(key = "") {
        return this.last(key);
    }
    // New Function: Get Item at Specific Index
    at(index) {
        const list = this.getAll();
        return index >= 0 && index < list.length ? list[index] : null; // Return item at index or null if out of bounds
    }
}
export default LocalStorage;