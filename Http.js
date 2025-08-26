// Http.js
class Http {
  constructor(baseURL = '', defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }

  async request(method, endpoint, { headers = {}, body, responseType = 'json', ...options } = {}) {
    const url = this.baseURL + endpoint;
    const finalHeaders = { ...this.defaultOptions.headers, ...headers };

    // --- Modern: Use fetch if available ---
    if (window.fetch) {
      const config = { method: method.toUpperCase(), headers: finalHeaders, ...options };

      if (body) {
        if (typeof body === 'object' && !(body instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
          config.body = JSON.stringify(body);
        } else {
          config.body = body;
        }
      }

      const res = await fetch(url, config);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      return this.parseResponse(res, responseType);
    }

    // --- Legacy: Fallback to XMLHttpRequest ---
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      for (const h in finalHeaders) {
        xhr.setRequestHeader(h, finalHeaders[h]);
      }

      xhr.responseType = responseType === 'json' ? 'text' : responseType; // xhr can't do json directly

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(
              responseType === 'json' ? JSON.parse(xhr.responseText) : xhr.response
            );
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));

      if (body) {
        if (typeof body === 'object' && !(body instanceof FormData)) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(body));
        } else {
          xhr.send(body);
        }
      } else {
        xhr.send();
      }
    });
  }

  parseResponse(res, type) {
    switch (type) {
      case 'json': return res.json();
      case 'text': return res.text();
      case 'blob': return res.blob();
      case 'arrayBuffer': return res.arrayBuffer();
      default: return res;
    }
  }

  // CRUD Helpers
  get(endpoint, options) { return this.request('GET', endpoint, options); }
  post(endpoint, body, options = {}) { return this.request('POST', endpoint, { ...options, body }); }
  put(endpoint, body, options = {}) { return this.request('PUT', endpoint, { ...options, body }); }
  patch(endpoint, body, options = {}) { return this.request('PATCH', endpoint, { ...options, body }); }
  delete(endpoint, options) { return this.request('DELETE', endpoint, options); }
}

// Example usage:
const api = new Http('https://example.com/api', {
  headers: { Authorization: 'Bearer TOKEN' }
});

// JSON
api.get('/users').then(console.log);

// Text
api.get('/status', { responseType: 'text' }).then(console.log);

// Blob (image)
api.get('/image.png', { responseType: 'blob' }).then(blob => {
  const imgURL = URL.createObjectURL(blob);
  document.querySelector('#logo').src = imgURL;
});
