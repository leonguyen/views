export class Json {
  constructor(data = {}) {
    this.data = data;
  }

  load(jsonStr) {
    try {
      this.data = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Invalid JSON', e);
    }
  }

  // Create/Set a value at a given path. This is essentially what 'update' was doing.
  // Renamed for clarity to 'set' as it can create new paths or update existing ones.
  set(path, value) {
    // Using a deep clone for immutability if preferred, but for simplicity, direct modification
    // if using lodash's _.set, it handles path creation.
    if (typeof _ !== 'undefined' && _.set) {
      _.set(this.data, path, value);
    } else {
      // Basic implementation if lodash is not available, only for top-level or direct children
      // For deep paths without lodash, a recursive function would be needed.
      const pathParts = path.split('.');
      let current = this.data;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]] || typeof current[pathParts[i]] !== 'object') {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = value;
    }
  }

  // Read a value from a given path
  get(path) {
    if (typeof _ !== 'undefined' && _.get) {
      return _.get(this.data, path);
    } else {
      // Basic implementation if lodash is not available
      const pathParts = path.split('.');
      let current = this.data;
      for (const part of pathParts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined; // Path not found
        }
      }
      return current;
    }
  }

  // Update (alias for set, or can be made to only update existing values)
  // For now, it behaves like 'set' allowing creation/update
  update(path, value) {
    this.set(path, value);
  }

  // Delete a value at a given path
  delete(path) {
    if (typeof _ !== 'undefined' && _.unset) {
      _.unset(this.data, path);
    } else {
      // Basic implementation if lodash is not available
      const pathParts = path.split('.');
      let current = this.data;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (current && typeof current === 'object' && pathParts[i] in current) {
          current = current[pathParts[i]];
        } else {
          return; // Path to parent not found, nothing to delete
        }
      }
      if (current && typeof current === 'object') {
        delete current[pathParts[pathParts.length - 1]];
      }
    }
  }

  // Method to add an item to an array at a given path
  addToList(path, item) {
    const list = this.get(path);
    if (Array.isArray(list)) {
      list.push(item);
      this.set(path, list); // Ensure the updated array is set back
    } else {
      console.warn(`Path '${path}' does not point to an array. Initializing as new array.`);
      this.set(path, [item]); // Create a new array with the item
    }
  }

  // Method to remove an item from an array at a given path
  removeFromList(path, item) {
    const list = this.get(path);
    if (Array.isArray(list)) {
      const initialLength = list.length;
      // Using filter to create a new array without the item
      const updatedList = list.filter(existingItem => existingItem !== item);
      if (updatedList.length < initialLength) {
        this.set(path, updatedList);
      } else {
        console.warn(`Item '${item}' not found in the list at path '${path}'.`);
      }
    } else {
      console.warn(`Path '${path}' does not point to an array.`);
    }
  }

  print() {
    console.log(this.toJSON());
  }

  toJSON() {
    return JSON.stringify(this.data, null, 2);
  }
}

/*
// Example Usage:

// Make sure lodash is available in your environment if you want to use deep path functionality without custom implementation
// For example, by importing it: import _ from 'lodash';

const initialData = {
  site: {
    title: 'My Website',
    views: 1200,
    authors: [
      { name: 'Alice', id: 1 },
      { name: 'Bob', id: 2 }
    ],
    settings: {}
  }
};

const manager = new Json(initialData);

console.log('--- Initial Data ---');
manager.print();

// CREATE / SET
manager.set('site.url', 'https://www.example.com');
manager.set('site.settings.darkMode', true);
manager.set('site.authors[2]', { name: 'Charlie', id: 3 }); // Add new author directly
console.log('\n--- After SET operations ---');
manager.print();

// READ
const siteTitle = manager.get('site.title');
console.log(`\nSite Title: ${siteTitle}`);
const authorBob = manager.get('site.authors[1]');
console.log('Author Bob:', authorBob);
const nonExistent = manager.get('site.version');
console.log('Non-existent property:', nonExistent);

// UPDATE
manager.update('site.views', 1500);
manager.update('site.authors[0].name', 'Alicia');
console.log('\n--- After UPDATE operations ---');
manager.print();

// DELETE
manager.delete('site.settings.darkMode');
manager.delete('site.url');
manager.delete('site.authors[2]'); // Delete Charlie
console.log('\n--- After DELETE operations ---');
manager.print();

// ADD TO LIST
manager.addToList('site.authors', { name: 'David', id: 4 });
manager.addToList('site.tags', 'web'); // Creates 'site.tags' as an array if it doesn't exist
manager.addToList('site.tags', 'development');
console.log('\n--- After ADD TO LIST operations ---');
manager.print();

// REMOVE FROM LIST
manager.removeFromList('site.tags', 'web');
manager.removeFromList('site.authors', { name: 'Bob', id: 2 }); // Note: This exact object comparison might not work as expected for complex objects
                                                              // You might need a more sophisticated comparison (e.g., by ID) for real-world scenarios.
manager.removeFromList('site.authors', { name: 'NonExistent', id: 99 });
console.log('\n--- After REMOVE FROM LIST operations ---');
manager.print();

// Example of how to access the underlying data directly (if needed, but generally discouraged for direct manipulation)
// console.log(manager.data);
*/
