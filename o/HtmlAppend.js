// Composite Pattern Base Class
class HtmlElement {
  constructor(tag, options = {}) {
    this.tag = tag;
    this.options = options;
    this.children = [];
  }

  // Set element attributes
  setAttr(key, value) {
    this.options[key] = value;
    return this;
  }

  // Get element attributes
  getAttr(key) {
    return this.options[key];
  }

  // Add children
  addChild(child) {
    this.children.push(child);
    return this;
  }

  addChildren(children) {
    children.forEach(child => this.addChild(child));
    return this;
  }

  // Add text content
  addText(text) {
    this.children.push(new HtmlText(text));
    return this;
  }

  // Convert to a DOM element
  toHtmlElement() {
    const element = document.createElement(this.tag);
    for (const [key, value] of Object.entries(this.options)) {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'id') {
        element.id = value;
      } else if (key === 'data') {
        for (const [dataKey, dataValue] of Object.entries(value)) {
          element.dataset[dataKey] = dataValue;
        }
      } else {
        element.setAttribute(key, value);
      }
    }
    this.children.forEach(child => {
      const childElement = child.toHtmlElement();
      if (childElement) {
        element.appendChild(childElement);
      }
    });
    return element;
  }
}

class HtmlText {
  constructor(text) {
    this.text = text;
  }

  toHtmlElement() {
    return document.createTextNode(this.text);
  }
}

// Specialized Elements
class Div extends HtmlElement {
  constructor(options = {}, children = []) {
    super('div', options);
    this.addChildren(children);
  }
}

class P extends HtmlElement {
  constructor(options = {}, children = []) {
    super('p', options);
    this.addChildren(children);
  }
}

class Img extends HtmlElement {
  constructor(options = {}) {
    super('img', options);
  }
}

class H3 extends HtmlElement {
  constructor(options = {}, children = []) {
    super('h3', options);
    this.addChildren(children);
  }
}

class Button extends HtmlElement {
  constructor(options = {}, children = []) {
    super('button', options);
    this.addChildren(children);
  }
}

class Input extends HtmlElement {
  constructor(type, options = {}) {
    super('input', { ...options, type });
  }
}

class Form extends HtmlElement {
  constructor(options = {}, children = []) {
    super('form', options);
    this.addChildren(children);
  }
}

// Bootstrap 5 Component Classes
class Card {
  constructor() {
    this.card = new Div({ class: "card shadow-sm" });
  }

  addHeader(text) {
    const header = new Div({ class: "card-header" });
    const h3 = new H3({ class: "card-title mb-0" }).addText(text);
    header.addChild(h3);
    this.card.addChild(header);
    return this;
  }

  addBody(children) {
    const body = new Div({ class: "card-body" });
    body.addChildren(children);
    this.card.addChild(body);
    return this;
  }

  toHtmlElement() {
    return this.card.toHtmlElement();
  }
}

/**
 * Represents a Dropzone-enhanced Form built with Html.js
 */
class DropzoneForm extends Form {
  /**
   * * @param {string} id - DOM ID of the Dropzone
   * @param {object} dzOptions - Dropzone configuration
   */
  constructor(id, dzOptions = {}) {
    super({ id, class: "dropzone", action: "#" });
    this.id = id;
    this.dzOptions = dzOptions;
  }

  initDropzone(customInitCallback = null) {
    Dropzone.autoDiscover = false;
    
    // Add the default message to the Dropzone element
    const messageDiv = new Div({ class: 'dz-message' }).addText('Drag and drop images here or click to upload.').toHtmlElement();
    this.toHtmlElement().appendChild(messageDiv);
    
    const dz = new Dropzone(`#${this.id}`, {
      ...this.dzOptions,
      url: this.dzOptions.url || "/", // Default URL if not provided
      autoProcessQueue: this.dzOptions.autoProcessQueue ?? false,
      addRemoveLinks: true
    });

    if (typeof customInitCallback === "function") {
      customInitCallback(dz);
    }

    return dz;
  }
}

// Global exports
window.HtmlElement = HtmlElement;
window.HtmlText = HtmlText;
window.Div = Div;
window.P = P;
window.Img = Img;
window.H3 = H3;
window.Button = Button;
window.Input = Input;
window.Form = Form;
window.Card = Card;
window.DropzoneForm = DropzoneForm;

