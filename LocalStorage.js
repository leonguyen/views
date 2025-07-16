class LocalStorage {
    constructor(key) {
        this.key = key;
    }
    static set(key, dataArray){
        this.key = key;
        localStorage.setItem(this.key, dataArray);
    }
    static get(key){
        return getAll();
    }
    getAll(key = "") {
        if(key && key.length > 0)
            this.key = key;
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }
    saveAll(dataArray) {
        localStorage.setItem(this.key, JSON.stringify(dataArray));
    }
    add(item) {
        const list = this.getAll();
        list.push(item);
        this.saveAll(list);
    }
    remove(index) {
        const list = this.getAll();
        list.splice(index, 1);
        this.saveAll(list);
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
    static last(key = "" ){
        return this.last(key);
    }
    // New Function: Get Item at Specific Index
    at(index) {
        const list = this.getAll();
        return index >= 0 && index < list.length ? list[index] : null; // Return item at index or null if out of bounds
    }
}