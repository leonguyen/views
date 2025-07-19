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
HtmlElement.prototype.addBs = function(...classes) {
  classes.flat().forEach(cls => this.addClass(cls));
  return this;
};
//Bootstrap 5
class BsContainer extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('container');
    if (attrs.fluid) this.addClass('container-fluid');
  }
}

class BsRow extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('row');
  }
}

class BsCol extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('col');
    if (attrs.size) this.addClass('col-' + attrs.size);
    if (attrs.breakpoint && attrs.size)
      this.addClass(`col-${attrs.breakpoint}-${attrs.size}`);
  }
}

class BsFlex extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('d-flex');
    if (attrs.justify) this.addClass('justify-content-' + attrs.justify);
    if (attrs.align) this.addClass('align-items-' + attrs.align);
  }
}
class BsTable extends Table {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('table');
    if (attrs.variant) this.addClass('table-' + attrs.variant); // striped, dark, etc.
    if (attrs.hover) this.addClass('table-hover');
    if (attrs.bordered) this.addClass('table-bordered');
    if (attrs.sm) this.addClass('table-sm');
  }
}

class BsImage extends Img {
  constructor(attrs = {}) {
    super(attrs);
    if (attrs.fluid) this.addClass('img-fluid');
    if (attrs.thumbnail) this.addClass('img-thumbnail');
    if (attrs.rounded) this.addClass('rounded');
  }
}

class BsLeadText extends P {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('lead');
  }
}
class BsForm extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('form', attrs, children);
  }
}

class BsFormGroup extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('mb-3');
  }
}

class BsInput extends Input {
  constructor(type = 'text', attrs = {}) {
    super(type, { ...attrs, class: 'form-control' });
  }
}

class BsLabel extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('label', attrs, children);
  }
}

class BsSelect extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('select', { ...attrs, class: 'form-select' }, children);
  }
}

class BsCheckbox extends Input {
  constructor(attrs = {}) {
    super('checkbox', { ...attrs, class: 'form-check-input' });
  }
}

class BsRadio extends Input {
  constructor(attrs = {}) {
    super('radio', { ...attrs, class: 'form-check-input' });
  }
}
class BsButton extends Button {
  constructor(attrs = {}, children = []) {
    super({ ...attrs }, children);
    this.addClass('btn');
    if (attrs.variant) this.addClass('btn-' + attrs.variant);
    if (attrs.size) this.addClass('btn-' + attrs.size); // lg, sm
  }
}

class BsAlert extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('alert');
    if (attrs.variant) this.addClass('alert-' + attrs.variant);
    if (attrs.dismissible) {
      this.addClass('alert-dismissible');
      this.addChild(new Button({
        type: 'button', class: 'btn-close', 'data-bs-dismiss': 'alert', 'aria-label': 'Close'
      }));
    }
  }
}

class BsBadge extends Span {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('badge');
    if (attrs.variant) this.addClass('bg-' + attrs.variant);
    if (attrs.pill) this.addClass('rounded-pill');
  }
}

class BsCard extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('card');
  }
}
class BsCardHeader extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('card-header');
  }
}
class BsCardBody extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('card-body');
  }
}

class BsNavbar extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('nav', attrs, children);
    this.addClass('navbar');
    if (attrs.expand) this.addClass('navbar-expand-' + attrs.expand);
    if (attrs.bg) this.addClass('bg-' + attrs.bg);
    if (attrs.variant) this.addClass('navbar-' + attrs.variant); // light/dark
  }
}

class BsAccordion extends Div {
  constructor(attrs = {}, children = []) {
    super(attrs, children);
    this.addClass('accordion');
  }
}
HtmlElement.prototype.addBs = function(...classes) {
  classes.flat().forEach(cls => this.addClass(cls));
  return this;
};
// Usage: el.addBs('mb-3', 'd-flex', 'justify-content-center')


// --- USAGE EXAMPLE (Builder Pattern) ---
/*
const img = new Img({ src: 'image.jpg', alt: 'desc' });
// document.body.innerHTML = img.toHtml();
*/
/*const card = new BsCard({}, [
  new BsCardHeader({}, [new HtmlText('Header')]),
  new BsCardBody({}, [new HtmlText('Body content here')])
]);

const alert = new BsAlert({ variant: 'warning', dismissible: true }, [
  new HtmlText('Be careful!')
]);
*/