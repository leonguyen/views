// Request.js (your custom OOP-style class)

class Request {
    constructor(method, url, options = {}) {
        this.method = method;
        this.url = url;
        this.options = options;
        this.xhr = new XMLHttpRequest(); // Or use fetch API
    }

    send(data = null) {
        return new Promise((resolve, reject) => {
            this.xhr.open(this.method, this.url, true);

            // Set headers if provided in options
            if (this.options.headers) {
                for (const header in this.options.headers) {
                    this.xhr.setRequestHeader(header, this.options.headers[header]);
                }
            }

            this.xhr.onload = () => {
                if (this.xhr.status >= 200 && this.xhr.status < 300) {
                    resolve(this.xhr.responseText);
                } else {
                    reject(new Error(`Request failed with status ${this.xhr.status}`));
                }
            };

            this.xhr.onerror = () => {
                reject(new Error('Network error'));
            };

            this.xhr.send(data);
        });
    }

    // Example static method for convenience
    static get(url, options) {
        return new Request('GET', url, options).send();
    }

    static post(url, data, options) {
        return new Request('POST', url, options).send(data);
    }
}

// --- xhook integration (can be in a separate file or at the top of your main script) ---

// Ensure xhook is loaded BEFORE your Request class makes any requests
// For example, if you're using a <script> tag:
// <script src="path/to/xhook.min.js"></script>
// <script src="path/to/Request.js"></script>
// <script src="path/to/your_main_app.js"></script>

// xhook.before allows you to modify the request before it's sent
/*
xhook.before(function(request, callback) {
    console.log('xhook: Intercepting request:', request.method, request.url);

    // Example: Add a custom header to all requests
    if (!request.headers['X-Custom-Header']) {
        request.headers['X-Custom-Header'] = 'Intercepted-by-xhook';
    }

    // Example: Block specific URLs
    if (request.url.includes('bad-url.com')) {
        console.warn('xhook: Blocking request to bad-url.com');
        return callback({
            status: 403,
            data: 'Request blocked by xhook'
        });
    }

    // Continue with the request
    callback();
});

// xhook.after allows you to modify the response after it's received
xhook.after(function(request, response, callback) {
    console.log('xhook: Intercepting response for:', request.method, request.url, 'Status:', response.status);

    // Example: Modify response data
    if (response.status === 200 && response.data.includes('secret')) {
        console.log('xhook: Modifying response data...');
        response.data = response.data.replace('secret', '[REDACTED_SECRET]');
    }

    // Continue with the original response
    callback();
});


// --- Usage Example (in your main application code) ---

async function makeRequests() {
    try {
        console.log('\nMaking a GET request...');
        const data1 = await Request.get('https://jsonplaceholder.typicode.com/todos/1', {
            headers: {
                'X-App-Id': 'MyApp'
            }
        });
        console.log('Response 1:', data1);

        console.log('\nMaking a POST request...');
        const data2 = await Request.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify({
            title: 'foo',
            body: 'bar secret', // This 'secret' will be redacted by xhook.after
            userId: 1,
        }), {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        console.log('Response 2:', data2);

        console.log('\nAttempting to request a blocked URL...');
        const data3 = await Request.get('http://bad-url.com/data');
        console.log('Response 3 (should be blocked):', data3);
    } catch (error) {
        console.error('Error during request:', error.message);
    }
}

makeRequests();
*/