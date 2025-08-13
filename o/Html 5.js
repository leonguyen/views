// ===== Integration of flow.js into Html.js =====

// It's assumed the Html.js file content is available here.

// 1. Add this script tag to your HTML file, preferably in the <head>
// <script src="//cdn.jsdelivr.net/npm/@flowjs/flow.js@1.1.1/dist/flow.min.js"></script>

class FlowUploader extends Div {
  constructor(targetUrl, attrs = {}) {
    super(attrs);

    // Set up default attributes for the drop area
    const dropAreaAttrs = {
      class: 'drop-area',
      style: 'border: 2px dashed #ccc; padding: 20px; text-align: center; cursor: pointer;'
    };

    // Create the HTML elements using your Html.js classes
    this.dropArea = new Div(dropAreaAttrs).addText('Drag & Drop files here');
    this.browseButton = new Span({ class: 'btn btn-primary mt-2' }).addText('Or browse files');
    this.statusMessage = new P().addText('Ready to upload.');
    this.progressBar = new Div({
      class: 'progress mt-2',
      style: 'height: 25px;'
    }).addChild(new Div({
      class: 'progress-bar',
      role: 'progressbar',
      'aria-valuenow': '0',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      style: 'width: 0%;'
    }));

    // Add all the children to the main div
    this.addChildren([this.dropArea, this.browseButton, this.statusMessage, this.progressBar]);

    // 2. Initialize the Flow.js instance
    this.flow = new Flow({
      target: targetUrl, // The URL to which to POST the file chunks
      chunkSize: 1024 * 1024, // 1MB chunk size
      testChunks: false
    });
  }

  // A method to start the integration and render to the DOM
  init() {
    // Check if flow.js is supported in the browser
    if (!this.flow.support) {
      this.statusMessage.setAttr('style', 'color: red;').addText('Flow.js is not supported in this browser.');
      return;
    }

    // 3. Use toHtmlElement() to get the DOM elements and assign them to flow.js
    const dropAreaDom = this.dropArea.toHtmlElement();
    const browseButtonDom = this.browseButton.toHtmlElement();

    this.flow.assignBrowse(browseButtonDom);
    this.flow.assignDrop(dropAreaDom);

    // 4. Set up event listeners for flow.js events
    this.flow.on('filesSubmitted', (file) => {
      this.statusMessage.addText(`File "${file.name}" added. Starting upload...`);
      this.flow.upload();
    });

    this.flow.on('fileProgress', (file) => {
      const progress = Math.floor(file.progress() * 100);
      const progressBarDom = this.progressBar.children[0].toHtmlElement();
      progressBarDom.style.width = `${progress}%`;
      progressBarDom.innerText = `${progress}%`;
    });

    this.flow.on('fileSuccess', (file, message) => {
      this.statusMessage.addText(`File "${file.name}" uploaded successfully.`);
    });

    this.flow.on('fileError', (file, message) => {
      this.statusMessage.setAttr('style', 'color: red;').addText(`Error uploading "${file.name}": ${message}`);
    });
  }
}

// 5. Usage example in your application:
// Assuming this code runs after Html.js and flow.js scripts are loaded
// const uploader = new FlowUploader('/your/upload/endpoint');
// uploader.init();
// document.body.appendChild(uploader.toHtmlElement());
