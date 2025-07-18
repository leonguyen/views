// Composite Pattern Base Class
class HtmlElement {
  constructor(tag = null, attrs = {}, children = []) {
    this.tag = tag;                 // The HTML tag (e.g. div, span)
    this.attrs = { ...attrs };      // Element attributes (id, class, etc.)
    this.children = children || []; // Child components
  }

  setTag(tag) { this.tag = tag; return this; }
  getTag() { return this.tag; }

  // Attributes
  setAttr(key, value) {
    if (value === null || value === undefined) delete this.attrs[key];
    else this.attrs[key] = value;
    return this;
  }
  getAttr(key) { return this.attrs[key]; }
  addAttrs(attrs) { Object.entries(attrs).forEach(([k, v]) => this.setAttr(k, v)); return this; }
  removeAttr(key) { delete this.attrs[key]; return this; }

  // Children
  addChild(child) { this.children.push(child); return this; }
  addText(text) { this.children.push(new HtmlText(text)); return this; }
  addRawHtml(html) { this.children.push(new HtmlRaw(html)); return this; }
  clearChildren() { this.children = []; return this; }

  // CSS Class utilities
  addClass(className) {
    const cur = (this.attrs.class || '').split(' ').filter(Boolean);
    if (!cur.includes(className)) cur.push(className);
    this.attrs.class = cur.join(' ');
    return this;
  }

  // Inline style
  setStyle(key, value) {
    const styleObj = this._parseStyle(this.attrs.style);
    styleObj[key] = value;
    this.attrs.style = this._stringifyStyle(styleObj);
    return this;
  }
  _parseStyle(style = '') {
    return (style || '').split(';')
      .filter(Boolean)
      .map(s => s.split(':').map(x => x.trim()))
      .reduce((acc, [k, v]) => (k ? { ...acc, [k]: v } : acc), {});
  }
  _stringifyStyle(styleObj) {
    return Object.entries(styleObj).map(([k, v]) => `${k}: ${v}`).join('; ');
  }

  // Event handler attributes
  setEvent(event, handler) { this.attrs['on' + event] = handler; return this; }
  removeEvent(event) { delete this.attrs['on' + event]; return this; }

  // Rendering to HTML (Composite)
  toHtml() {
    if (!this.tag) return this.children.map(c => c.toHtml()).join('');
    const voidTags = new Set(['img','input','br','hr','meta','link','base','area','col','embed','source','track','wbr']);
    const attrs = Object.entries(this.attrs).map(([k, v]) =>
      v === true ? k : v === false || v == null ? '' : `${k}="${HtmlElement.escapeAttr(v)}"`
    ).filter(Boolean).join(' ');
    const markupOpen = `<${this.tag}${attrs ? ' ' + attrs : ''}>`;
    if (voidTags.has(this.tag)) return markupOpen;
    return `${markupOpen}${this.children.map(c => c.toHtml()).join('')}</${this.tag}>`;
  }
  toString() { return this.toHtml(); }

  // Helpers
  static escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  static escapeAttr(str) { return HtmlElement.escapeHtml(str).replace(/"/g, '&quot;'); }
}

// Leaf node for plain text
class HtmlText {
  constructor(text) { this.text = text; }
  toHtml() { return HtmlElement.escapeHtml(this.text); }
}

// Leaf node for raw HTML
class HtmlRaw {
  constructor(html) { this.html = html; }
  toHtml() { return this.html; }
}

// Specialized Elements (Builder pattern usage)
class Div extends HtmlElement { constructor(attrs = {}, children = []) { super('div', attrs, children); } }
class Span extends HtmlElement { constructor(attrs = {}, children = []) { super('span', attrs, children); } }
class Input extends HtmlElement { constructor(type, attrs = {}) { super('input', { type, ...attrs }); } }
class Button extends HtmlElement { constructor(attrs = {}, children = []) { super('button', attrs, children); } }
class P extends HtmlElement { constructor(attrs = {}, children = []) { super('p', attrs, children); } }
class Img extends HtmlElement { constructor(attrs = {}) { super('img', attrs); } }
class A extends HtmlElement { constructor(attrs = {}, children = []) { super('a', attrs, children); } }
class Ul extends HtmlElement { constructor(attrs = {}, children = []) { super('ul', attrs, children); } }
class Li extends HtmlElement { constructor(attrs = {}, children = []) { super('li', attrs, children); } }
class Table extends HtmlElement { constructor(attrs = {}, children = []) { super('table', attrs, children); } }
class Tr extends HtmlElement { constructor(attrs = {}, children = []) { super('tr', attrs, children); } }
class Td extends HtmlElement { constructor(attrs = {}, children = []) { super('td', attrs, children); } }

// Form Builder (Builder pattern + Composite)
class FormBuilder {
  constructor(action, method = 'POST', enctype, legendText) {
    this.form = new HtmlElement('form', { action, method, ...(enctype && { enctype }) });
    this.fieldset = new HtmlElement('fieldset');
    if (legendText) this.fieldset.addChild(new HtmlElement('legend').addText(legendText));
    this.form.addChild(this.fieldset);
  }
  addInput(type, labelTxt, name, value, state = '') {
    const label = new HtmlElement('label').addText(labelTxt + ' ');
    const input = new HtmlElement('input', { type, name, value });
    if (/c/i.test(state)) input.setAttr('checked', true);
    if (/d/i.test(state)) input.setAttr('disabled', true);
    if (/r/i.test(state)) input.setAttr('readonly', true);
    this.fieldset.addChild(new HtmlElement('div').addChild(label).addChild(input));
    return this;
  }
  addTextarea(labelTxt, name, value) {
    const label = new HtmlElement('label').addText(labelTxt + ' ');
    const textarea = new HtmlElement('textarea', { name }).addText(value || '');
    this.fieldset.addChild(new HtmlElement('div').addChild(label).addChild(textarea));
    return this;
  }
  build(targetId) {
    document.getElementById(targetId).innerHTML = this.form.toHtml();
  }
}

// --- USAGE EXAMPLE (Builder Pattern) ---
// const img = new Img({ src: 'image.jpg', alt: 'desc' });
// document.body.innerHTML = img.toHtml();
