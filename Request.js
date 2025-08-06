class Request {
  constructor(method, url, options = {}) {
    this.method = method.toUpperCase();
    this.url = url;
    this.options = options;
    this.xhr = new XMLHttpRequest();
  }

  send(data = null) {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, true);

      // Set headers if provided
      if (this.options.headers) {
        for (const header in this.options.headers) {
          this.xhr.setRequestHeader(header, this.options.headers[header]);
        }
      }

      // Handle response
      this.xhr.onload = () => {
        // HTTP status between 200-299 are success
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          resolve(this.xhr.responseText);
        } else {
          reject(new Error(`Request failed with status ${this.xhr.status}: ${this.xhr.statusText}`));
        }
      };

      // Handle network errors
      this.xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      // Send request with data if provided
      if (data) {
        this.xhr.send(data);
      } else {
        this.xhr.send();
      }
    });
  }

  // Static convenience methods for HTTP verbs
  static get(url, options) {
    return new Request('GET', url, options).send();
  }

  static post(url, data, options) {
    return new Request('POST', url, options).send(data);
  }

  static put(url, data, options) {
    return new Request('PUT', url, options).send(data);
  }

  static patch(url, data, options) {
    return new Request('PATCH', url, options).send(data);
  }

  static delete(url, options) {
    return new Request('DELETE', url, options).send();
  }
}
/*
const SUPABASE_URL = 'https://your-project-id.supabase.co/rest/v1/your_table';
const SUPABASE_API_KEY = 'your-anon-key';

const headers = {
  apikey: SUPABASE_API_KEY,
  Authorization: `Bearer ${SUPABASE_API_KEY}`,
  'Content-Type': 'application/json',
};

// GET request example
Request.get(SUPABASE_URL + '?id=eq.1', { headers })
  .then(res => console.log(JSON.parse(res)))
  .catch(console.error);

// POST request example
const newRow = { name: 'Alice', age: 25 };
Request.post(SUPABASE_URL, JSON.stringify(newRow), { headers })
  .then(res => console.log(JSON.parse(res)))
  .catch(console.error);

// PATCH request example
const updatedData = { age: 26 };
Request.patch(SUPABASE_URL + '?id=eq.1', JSON.stringify(updatedData), { headers })
  .then(res => console.log(JSON.parse(res)))
  .catch(console.error);

// DELETE request example
Request.delete(SUPABASE_URL + '?id=eq.1', { headers })
  .then(res => console.log(JSON.parse(res)))
  .catch(console.error);
*/