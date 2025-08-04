// ===== Html.js =====
// Composite Pattern Base Class
class HtmlElement {
  constructor(tag = null, attrs = {}, children = []) {
    this.tag = tag; // The HTML tag (e.g. div, span)
    this.attrs = { ...attrs }; // Element attributes (id, class, etc.)
    this.children = children || []; // Child elements
  }

  setTag(tag) {
    this.tag = tag;
    return this;
  }

  getTag() {
    return this.tag;
  }

  // Attributes
  setAttr(key, value) {
    if (value === null || value === undefined) delete this.attrs[key];
    else this.attrs[key] = value;
    return this;
  }

  getAttr(key) {
    return this.attrs[key];
  }

  addAttrs(attrs) {
    Object.entries(attrs).forEach(([k, v]) => this.setAttr(k, v));
    return this;
  }

  removeAttr(key) {
    delete this.attrs[key];
    return this;
  }

  // Children
  addChild(child) {
    this.children.push(child);
    return this;
  }

  addText(text) {
    this.children.push(new HtmlText(text));
    return this;
  }

  addRawHtml(html) {
    this.children.push(new HtmlRaw(html));
    return this;
  }

  clearChildren() {
    this.children = [];
    return this;
  }

  // CSS Class utilities
  addClass(className) {
    const cur = (this.attrs.class || '').split(' ').filter(Boolean);
    if (!cur.includes(className)) cur.push(className);
    this.attrs.class = cur.join(' ');
    return this;
  }

  removeClass(className) {
    const cur = (this.attrs.class || '').split(' ').filter(Boolean);
    this.attrs.class = cur.filter(c => c !== className).join(' ');
    return this;
  }

  // Inline style (use sparingly, prefer Bootstrap classes)
  setStyle(key, value) {
    const styleObj = this._parseStyle(this.attrs.style || '');
    styleObj[key] = value;
    this.attrs.style = this._stringifyStyle(styleObj);
    return this;
  }

  _parseStyle(style = '') {
    return style.split(';')
      .filter(Boolean)
      .map(s => s.split(':').map(x => x.trim()))
      .reduce((acc, [k, v]) => (k ? { ...acc, [k]: v } : acc), {});
  }

  _stringifyStyle(styleObj) {
    return Object.entries(styleObj)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
  }

  // Event handler attributes
  setEvent(event, handler) {
    this.attrs['on' + event] = handler;
    return this;
  }

  removeEvent(event) {
    delete this.attrs['on' + event];
    return this;
  }

  // Rendering to HTML (Composite)
  toHtml() {
    if (!this.tag) return this.children.map(c => c.toHtml()).join('');

    const voidTags = new Set([
      'img', 'input', 'br', 'hr', 'meta', 'link', 'base', 'area', 'col', 'embed', 'source',
      'track', 'wbr'
    ]);

    const attrs = Object.entries(this.attrs)
      .map(([k, v]) =>
        v === true ? k :
        v === false || v == null ? '' :
        `${k}="${HtmlElement.escapeAttr(v)}"`
      )
      .filter(Boolean)
      .join(' ');

    const markupOpen = `<${this.tag}${attrs ? ' ' + attrs : ''}>`;

    if (voidTags.has(this.tag)) return markupOpen;

    return `${markupOpen}${this.children.map(c => c.toHtml()).join('')}</${this.tag}>`;
  }

  // New method to convert to a DOM element
  toHtmlElement() {
    if (!this.tag) {
      // If it's a wrapper for children, create a document fragment or span
      const fragment = document.createDocumentFragment();
      this.children.forEach(child => {
        const el = child.toHtmlElement();
        if (el) fragment.appendChild(el);
      });
      return fragment;
    }

    const element = document.createElement(this.tag);

    for (const key in this.attrs) {
      if (this.attrs.hasOwnProperty(key)) {
        const value = this.attrs[key];
        if (value === true) {
          element.setAttribute(key, '');
        } else if (value !== false && value !== null && value !== undefined) {
          element.setAttribute(key, value);
        }
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

  toString() {
    return this.toHtml();
  }

  // Helpers
  static escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static escapeAttr(str) {
    return HtmlElement.escapeHtml(str).replace(/"/g, '&quot;');
  }
}

// Leaf node for plain text
class HtmlText {
  constructor(text) {
    this.text = text;
  }

  toHtml() {
    return HtmlElement.escapeHtml(this.text);
  }

  toHtmlElement() {
    return document.createTextNode(this.text);
  }
}

// Leaf node for raw HTML
class HtmlRaw {
  constructor(html) {
    this.html = html;
  }

  toHtml() {
    return this.html;
  }

  toHtmlElement() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.html;
    // If the raw HTML is a single element, return that element.
    // Otherwise, return a document fragment containing all parsed elements.
    if (tempDiv.children.length === 1) {
      return tempDiv.firstElementChild;
    } else {
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      return fragment;
    }
  }
}

// Specialized Elements (Builder pattern usage)
class H1 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h1', attrs, children);
  }
}
class H2 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h2', attrs, children);
  }
}
class H3 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h3', attrs, children);
  }
}
class H4 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h4', attrs, children);
  }
}
class H5 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h5', attrs, children);
  }
}
class H6 extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('h6', attrs, children);
  }
}

class Div extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('div', attrs, children);
  }
}

class Span extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('span', attrs, children);
  }
}

class Form extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('form', attrs, children);
  }
}

class Input extends HtmlElement {
  constructor(type, attrs = {}) {
    super('input', { type, ...attrs });
  }
}

class Textarea extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('textarea', attrs, children);
  }
}

class Button extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('button', attrs, children);
  }
}

class P extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('p', attrs, children);
  }
}

class Img extends HtmlElement {
  constructor(attrs = {}) {
    super('img', attrs);
  }
}

class A extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('a', attrs, children);
  }
}

class Ul extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('ul', attrs, children);
  }
}

class Li extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('li', attrs, children);
  }
}

class Table extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('table', attrs, children);
  }
}

class Thead extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('thead', attrs, children);
  }
}

class Tbody extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('tbody', attrs, children);
  }
}

class Tr extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('tr', attrs, children);
  }
}

class Th extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('th', attrs, children);
  }
}

class Td extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('td', attrs, children);
  }
}

// === New Bootstrap 5 Component Classes / Helpers ===

/**
 * Represents a Bootstrap 5 Card component.
 */
class Card extends Div {
  constructor(attrs = {}, children = []) {
    super({ class: 'card', ...attrs }, children);
  }

  addHeader(headerContent) {
    const header = new Div({ class: 'card-header' }).addRawHtml(headerContent);
    this.addChild(header);
    return this;
  }

  addBody(bodyContent) {
    const body = new Div({ class: 'card-body' });
    if (typeof bodyContent === 'string') {
      body.addRawHtml(bodyContent);
    } else if (bodyContent instanceof HtmlElement) {
      body.addChild(bodyContent);
    } else if (Array.isArray(bodyContent)) {
      bodyContent.forEach(item => {
        if (typeof item === 'string') body.addRawHtml(item);
        else if (item instanceof HtmlElement) body.addChild(item);
      });
    }
    this.addChild(body);
    return this;
  }

  addFooter(footerContent) {
    const footer = new Div({ class: 'card-footer' }).addRawHtml(footerContent);
    this.addChild(footer);
    return this;
  }
}

/**
 * Represents a Bootstrap 5 Badge component.
 */
class Badge extends Span {
  constructor(text, type = 'primary', attrs = {}) {
    super({ class: `badge bg-${type}`, ...attrs });
    this.addText(text);
  }
}

/**
 * Represents a Bootstrap 5 Spinner component.
 */
class Spinner extends Div {
  constructor(type = 'border', color = 'primary', srText = 'Loading...', attrs = {}) {
    super({ class: `spinner-${type} text-${color}`, role: 'status', ...attrs });
    this.addChild(new Span({ class: 'visually-hidden' }).addText(srText));
  }
}

/**
 * Represents a Bootstrap 5 Accordion container.
 */
class Accordion extends Div {
  constructor(id, attrs = {}) {
    super({ class: 'accordion', id: id, ...attrs });
  }

  /**
   * Adds an item to the accordion.
   * @param {string} headerContent - The content for the accordion header.
   * @param {HtmlElement|string} bodyContent - The content for the accordion body.
   * @param {boolean} expanded - Whether the item should be expanded by default.
   * @param {string} itemId - Optional unique ID for the item.
   * @returns {Accordion}
   */
  addItem(headerContent, bodyContent, expanded = false, itemId = `item-${Math.random().toString(36).substr(2, 9)}`) {
    const accordionItem = new AccordionItem(this.getAttr('id'), itemId, headerContent, bodyContent, expanded);
    this.addChild(accordionItem);
    return this;
  }
}

/**
 * Represents a single collapsible item within a Bootstrap Accordion.
 */
class AccordionItem extends Div {
  constructor(parentId, itemId, headerContent, bodyContent, expanded) {
    super({ class: 'accordion-item' });
    this.addChild(new AccordionHeader(parentId, itemId, headerContent, expanded));
    this.addChild(new AccordionBody(parentId, itemId, bodyContent, expanded));
  }
}

/**
 * Represents the header of an AccordionItem.
 */
class AccordionHeader extends H2 {
  constructor(parentId, itemId, headerContent, expanded) {
    super({ class: 'accordion-header' });
    const buttonAttrs = {
      class: `accordion-button ${expanded ? '' : 'collapsed'}`,
      type: 'button',
      'data-bs-toggle': 'collapse',
      'data-bs-target': `#collapse-${itemId}`,
      'aria-expanded': expanded,
      'aria-controls': `collapse-${itemId}`
    };
    this.addChild(new Button(buttonAttrs).addRawHtml(headerContent));
  }
}

/**
 * Represents the collapsible body of an AccordionItem.
 */
class AccordionBody extends Div {
  constructor(parentId, itemId, bodyContent, expanded) {
    super({
      id: `collapse-${itemId}`,
      class: `accordion-collapse collapse ${expanded ? 'show' : ''}`,
      'data-bs-parent': `#${parentId}`
    });
    this.addChild(new Div({ class: 'accordion-body' }).addRawHtml(typeof bodyContent === 'string' ? bodyContent : bodyContent.toHtml()));
  }
}

/**
 * Builds a Bootstrap 5 List Group.
 * @param {Array<object>} items - Array of list item objects, e.g., [{ text: 'Item 1', href: '#', active: true }]
 * @param {string} type - 'ul' for <ul> based list-group, 'div' for <div> based list-group
 * @param {object} attrs - Additional attributes for the main list group container.
 * @returns {HtmlElement} The list group HtmlElement.
 */
function buildListGroup(items, type = 'ul', attrs = {}) {
  const listContainer = type === 'ul' ? new Ul({ class: 'list-group', ...attrs }) : new Div({ class: 'list-group', ...attrs });

  items.forEach(item => {
    const itemAttrs = { class: 'list-group-item' };
    if (item.active) itemAttrs.class += ' active';
    if (item.disabled) itemAttrs.class += ' disabled';

    let listItem;
    if (item.href) {
      listItem = new A({ ...itemAttrs, class: itemAttrs.class + ' list-group-item-action', href: item.href });
    } else {
      listItem = new Li(itemAttrs);
    }
    listItem.addText(item.text);
    listContainer.addChild(listItem);
  });
  return listContainer;
}

// Assign to global scope for classic JS
window.HtmlElement = HtmlElement;
window.HtmlText = HtmlText;
window.HtmlRaw = HtmlRaw;
window.H1 = H1;
window.H2 = H2;
window.H3 = H3;
window.H4 = H4;
window.H5 = H5;
window.H6 = H6;
window.Div = Div;
window.Span = Span;
window.Form = Form;
window.Input = Input;
window.Textarea = Textarea;
window.Button = Button;
window.P = P;
window.Img = Img;
window.A = A;
window.Ul = Ul;
window.Li = Li;
window.Table = Table;
window.Thead = Thead;
window.Tbody = Tbody;
window.Th = Th;
window.Tr = Tr;
window.Td = Td;
// New Bootstrap 5 specific exports
window.Card = Card;
window.Badge = Badge;
window.Spinner = Spinner;
window.Accordion = Accordion;
window.AccordionItem = AccordionItem;
window.AccordionHeader = AccordionHeader;
window.AccordionBody = AccordionBody;
window.buildListGroup = buildListGroup;


// ===== TableBuilder.js =====
window.buildTable = function buildTable(headers, rows) {
  const thead = new Thead().addChild(
    new Tr().addChild(...headers.map(h => new Th().addText(h)))
  );
  const tbody = new Tbody();
  rows.forEach(row => {
    tbody.addChild(new Tr().addChild(...row.map(cell => new Td().addText(cell))));
  });
  return new Table({ class: 'table table-bordered' }).addChild(thead).addChild(tbody).toHtml();
};

// ===== AlertBuilder.js =====
window.buildAlert = function buildAlert(type, message) {
  return new Div({ class: `alert alert-${type}`, role: 'alert' })
    .addText(message)
    .toHtml();
};

// ===== FormBuilder.js =====
window.buildForm = function buildForm(fields, submitText = 'Submit') {
  const form = new Form({ class: 'form' });

  fields.forEach(field => {
    const group = new Div({ class: 'mb-3' });
    let inputElement;
    if (field.type === 'textarea') {
      inputElement = new Textarea({
        class: 'form-control',
        id: field.id,
        placeholder: field.placeholder || ''
      });
    } else {
      inputElement = new Input(field.type, {
        class: 'form-control',
        id: field.id,
        placeholder: field.placeholder || ''
      });
    }
    group.addChild(inputElement);
    form.addChild(group);
  });

  form.addChild(new Button({ type: 'submit', class: 'btn btn-primary' }).addText(submitText));
  return form.toHtml();
};

// ===== ModalBuilder.js =====
window.buildModal = function buildModal(id, title, body) {
  return new Div({ class: 'modal fade', id: id, tabindex: '-1' })
    .addChild(
      new Div({ class: 'modal-dialog' })
        .addChild(
          new Div({ class: 'modal-content' })
            .addChild(new Div({ class: 'modal-header' })
              .addChild(new Div({ class: 'modal-title h5' }).addText(title))
              .addChild(new Button({ type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' })))
            .addChild(new Div({ class: 'modal-body' }).addChild(new Div().addText(body)))
            .addChild(new Div({ class: 'modal-footer' })
              .addChild(new Button({ type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }).addText('Close')))
        )
    ).toHtml();
};
