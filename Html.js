// ===== Merged Html.js & HtmlAdmin.js =====
// Composite Pattern Base Class
class HtmlElement {
  constructor(tag = null, attrs = {}, children = []) {
    this.tag = tag;
    this.attrs = { ...attrs };
    this.children = children || [];
  }

  setTag(tag) {
    this.tag = tag;
    return this;
  }

  getTag() {
    return this.tag;
  }

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

  addChild(child) {
    this.children.push(child);
    return this;
  }

  addChildren(children) {
    children.forEach(child => this.addChild(child));
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

  setEvent(event, handler) {
    this.attrs['on' + event] = handler;
    return this;
  }

  removeEvent(event) {
    delete this.attrs['on' + event];
    return this;
  }

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

  toHtmlElement() {
    if (!this.tag) {
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
        if (key === 'class') {
          element.className = value;
        } else if (key === 'id') {
          element.id = value;
        } else if (key === 'data' && typeof value === 'object') {
          for (const [dataKey, dataValue] of Object.entries(value)) {
            element.dataset[dataKey] = dataValue;
          }
        } else if (value === true) {
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

class Label extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('label', attrs, children);
  }
}

class Strong extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('strong', attrs, children);
  }
}

class I extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('i', attrs, children);
  }
}

class B extends HtmlElement {
  constructor(attrs = {}, children = []) {
    super('b', attrs, children);
  }
}

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

// Semantic HTML5 tags from HtmlAdmin.js
class Nav extends HtmlElement { constructor(attrs = {}, children = []){ super('nav', attrs, children);} }
class Aside extends HtmlElement { constructor(attrs = {}, children = []){ super('aside', attrs, children);} }
class Main extends HtmlElement { constructor(attrs = {}, children = []){ super('main', attrs, children);} }
class Footer extends HtmlElement { constructor(attrs = {}, children = []){ super('footer', attrs, children);} }
class Ol extends HtmlElement { constructor(attrs = {}, children = []){ super('ol', attrs, children);} }


// === Bootstrap 5 Component Classes / Helpers ===
class Card extends Div {
  constructor(attrs = {}, children = []) {
    super({ class: 'card', ...attrs }, children);
  }

  addHeader(headerContent) {
    const header = new Div({ class: 'card-header' });
    if (typeof headerContent === 'string') {
        const h3 = new H3({ class: "card-title mb-0" }).addText(headerContent);
        header.addChild(h3);
    } else {
        header.addRawHtml(headerContent);
    }
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

class Badge extends Span {
  constructor(text, type = 'primary', attrs = {}) {
    super({ class: `badge bg-${type}`, ...attrs });
    this.addText(text);
  }
}

class Spinner extends Div {
  constructor(type = 'border', color = 'primary', srText = 'Loading...', attrs = {}) {
    super({ class: `spinner-${type} text-${color}`, role: 'status', ...attrs });
    this.addChild(new Span({ class: 'visually-hidden' }).addText(srText));
  }
}

class Accordion extends Div {
  constructor(id, attrs = {}) {
    super({ class: 'accordion', id: id, ...attrs });
  }

  addItem(headerContent, bodyContent, expanded = false, itemId = `item-${Math.random().toString(36).substr(2, 9)}`) {
    const accordionItem = new AccordionItem(this.getAttr('id'), itemId, headerContent, bodyContent, expanded);
    this.addChild(accordionItem);
    return this;
  }
}

class AccordionItem extends Div {
  constructor(parentId, itemId, headerContent, bodyContent, expanded) {
    super({ class: 'accordion-item' });
    this.addChild(new AccordionHeader(parentId, itemId, headerContent, expanded));
    this.addChild(new AccordionBody(parentId, itemId, bodyContent, expanded));
  }
}

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

// === AdminLTE 5 Component Classes / Helpers ===
function loadAdminLTE5Deps({ adminlteVersion = '4.0.0' } = {}) {
  const cssUrls = [
    `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/css/adminlte.min.css`,
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/tabulator-tables@5.5.1/dist/css/tabulator_bootstrap5.min.css"
  ];
  const jsUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
    `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/js/adminlte.min.js`,
    "https://cdn.jsdelivr.net/npm/tabulator-tables@5.5.1/dist/js/tabulator.min.js"
  ];

  let loadedCount = 0;
  const totalCount = cssUrls.length + jsUrls.length;

  function assetLoaded() {
    loadedCount++;
    if (loadedCount === totalCount) {
      document.dispatchEvent(new Event("AdminLTEReady"));
    }
  }

  cssUrls.forEach(url => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = assetLoaded;
    document.head.appendChild(link);
  });

  jsUrls.forEach(url => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = assetLoaded;
    document.body.appendChild(script);
  });
}

class AdminLTEWrapper extends Div {
  constructor(attrs = {}, children = []) {
    super({ class: 'wrapper', ...attrs }, children);
  }
}

class AdminLTENavbar extends Nav {
  constructor(attrs = {}, children = []) {
    super({ class: 'main-header navbar navbar-expand navbar-white navbar-light', ...attrs }, children);
  }
  addLeftToggleButton(){
    const btn = new A({ href: '#', class: 'nav-link', 'data-lte-toggle': 'sidebar', role: 'button' })
      .addRawHtml('<i class="fas fa-bars"></i>');
    this.addChild(new Div({ class: 'navbar-nav' }).addChild(btn));
    return this;
  }
}

class AdminLTESidebar extends Aside {
  constructor(brandHtml, attrs = {}, children = []){
    super({ class: 'main-sidebar sidebar-dark-primary elevation-4', ...attrs }, children);
    if (brandHtml) {
      const brand = new A({ href: '#', class: 'brand-link' }).addRawHtml(brandHtml);
      this.addChild(brand);
    }
    this._sidebarContent = new Div({ class: 'sidebar' });
    this.addChild(this._sidebarContent);
  }
  addUserPanel(html){
    const up = new Div({ class: 'user-panel mt-3 pb-3 mb-3 d-flex' }).addRawHtml(html);
    this._sidebarContent.addChild(up);
    return this;
  }
  addMenu(menuEl){
    this._sidebarContent.addChild(menuEl);
    return this;
  }
}

class AdminLTEContentWrapper extends Div {
  constructor(attrs = {}, children = []){
    super({ class: 'content-wrapper', ...attrs }, children);
  }
  addContentHeader(title, breadcrumbEl = null){
    const header = new Div({ class: 'content-header' })
      .addChild(new Div({ class: 'container-fluid' })
        .addChild(new Div({ class: 'row mb-2' })
          .addChild(new Div({ class: 'col-sm-6' }).addChild(new H3({ class: 'm-0' }).addText(title || '')))
          .addChild(new Div({ class: 'col-sm-6' }).addChild(breadcrumbEl || new Div()))
        )
      );
    this.addChild(header);
    return this;
  }
  addMainContent(el){
    const section = new Div({ class: 'content' }).addChild(new Div({ class: 'container-fluid' }).addChild(el));
    this.addChild(section);
    return this;
  }
}

class AdminLTEFooter extends Footer {
  constructor(attrs = {}, children = []){
    super({ class: 'main-footer', ...attrs }, children);
  }
}

class AdminLTECard extends Card {
  constructor(type = 'primary', outline = false, attrs = {}, children = []){
    const cls = outline ? `card card-outline card-${type}` : `card card-${type}`;
    super({ class: cls, ...attrs }, children);
  }
  addTools(html){
    const lastHeader = this.children.find(c => c.attrs && c.attrs.class && c.attrs.class.includes('card-header'));
    if (lastHeader) {
      lastHeader.addRawHtml(`<div class="card-tools">${html}</div>`);
    }
    return this;
  }
}

class AdminLTEInfoBox extends Div {
  constructor(iconClass, text, number, bg='info', attrs = {}){
    super({ class: 'info-box', ...attrs });
    this.addChild(new Span({ class: `info-box-icon bg-${bg}` }).addRawHtml(`<i class="${iconClass}"></i>`));
    const content = new Div({ class: 'info-box-content' })
      .addChild(new Span({ class: 'info-box-text' }).addText(text))
      .addChild(new Span({ class: 'info-box-number' }).addText(number));
    this.addChild(content);
  }
}

class AdminLTESmallBox extends Div {
  constructor(number, text, iconClass='fa fa-chart-pie', bg='info', linkHref = '#', attrs = {}){
    super({ class: `small-box bg-${bg}`, ...attrs });
    const inner = new Div({ class: 'inner' }).addChild(new H3().addText(String(number))).addChild(new P().addText(text));
    const icon = new Div({ class: 'icon' }).addRawHtml(`<i class="${iconClass}"></i>`);
    const link = new A({ href: linkHref, class: 'small-box-footer' }).addRawHtml('More info <i class="fas fa-arrow-circle-right"></i>');
    this.addChild(inner).addChild(icon).addChild(link);
  }
}

class AdminLTECallout extends Div {
  constructor(title, message, type='info', attrs = {}){
    super({ class: `callout callout-${type}`, ...attrs });
    if (title) this.addChild(new H5().addText(title));
    if (message) this.addChild(new P().addText(message));
  }
}

class AdminLTETable extends Table {
  constructor(attrs = {}, headers = [], rows = []){
    super({ class: 'table table-bordered table-hover', ...attrs });
    if (headers.length) this.addChild(new Thead().addChild(new Tr().addChildren(headers.map(h => new Th().addText(h)))));
    const tb = new Tbody();
    rows.forEach(row => tb.addChild(new Tr().addChildren(row.map(c => new Td().addText(c)))));
    this.addChild(tb);
  }
}

function buildAdminBreadcrumb(items = []){
  const ol = new Ol({ class: 'breadcrumb float-sm-end' });
  items.forEach(it => ol.addChild(new Li({ class: 'breadcrumb-item' }).addChild(it.href ? new A({ href: it.href }).addText(it.text) : new Span().addText(it.text))));
  return new Div({ class: 'container-fluid' }).addChild(new Div({ class: 'row mb-2' })
    .addChild(new Div({ class: 'col-sm-6' }))
    .addChild(new Div({ class: 'col-sm-6' }).addChild(ol)));
}

function buildAdminMenu(items = []){
  const nav = new Nav({ class: 'mt-2' });
  const ul = new Ul({ class: 'nav nav-pills nav-sidebar flex-column', role: 'menu', 'data-accordion': 'false' });

  function makeItem(it){
    const li = new Li({ class: 'nav-item' });
    if (it.children && it.children.length){
      const a = new A({ href: '#', class: 'nav-link' }).addRawHtml(`<i class="nav-icon ${it.icon || 'far fa-circle'}"></i><p>${it.text}<i class="right fas fa-angle-left"></i></p>`);
      const innerUl = new Ul({ class: 'nav nav-treeview' });
      it.children.forEach(c => innerUl.addChild(makeItem(c)));
      li.addChild(a).addChild(innerUl);
    } else {
      const a = new A({ href: it.href || '#', class: `nav-link ${it.active ? 'active' : ''}` }).addRawHtml(`<i class="nav-icon ${it.icon || 'far fa-circle'}"></i><p>${it.text}${it.badge ? `<span class=\"right badge badge-${it.badge.type || 'danger'}\">${it.badge.text}</span>` : ''}</p>`);
      li.addChild(a);
    }
    return li;
  }

  items.forEach(i => ul.addChild(makeItem(i)));
  nav.addChild(ul);
  return nav;
}

// ===== Utility functions =====
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') {
      el.className = value;
    } else {
      el.setAttribute(key, value);
    }
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });

  return el;
}

function buildTable(headers, rows) {
  const thead = new Thead().addChild(
    new Tr().addChild(...headers.map(h => new Th().addText(h)))
  );
  const tbody = new Tbody();
  rows.forEach(row => {
    tbody.addChild(new Tr().addChild(...row.map(cell => new Td().addText(cell))));
  });
  return new Table({ class: 'table table-bordered' }).addChild(thead).addChild(tbody).toHtml();
}

function buildAlert(type, message) {
  return new Div({ class: `alert alert-${type}`, role: 'alert' })
    .addText(message)
    .toHtml();
}

function buildForm(fields, submitText = 'Submit') {
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
}

function buildModal(id, title, body) {
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
}


class DropzoneForm extends Form {
  constructor(id, dzOptions = {}, children = []) {
    super({ id, class: "dropzone", action: "/", enctype: "multipart/form-data" }, children);

    this.id = id;
    this.dzOptions = dzOptions;
    this.initialized = false;
  }

  initDropzone(customInitCallback = null) {
    Dropzone.autoDiscover = false;
    
    const messageDiv = new Div({ class: 'dz-message' }).addText('Drag and drop images here or click to upload.').toHtmlElement();
    const element = this.toHtmlElement();
    element.appendChild(messageDiv);
    
    const dz = new Dropzone(`#${this.id}`, {
      url: this.dzOptions.url || "/",
      autoProcessQueue: this.dzOptions.autoProcessQueue ?? false,
      maxFiles: this.dzOptions.maxFiles ?? null,
      acceptedFiles: this.dzOptions.acceptedFiles ?? "image/*",
      addRemoveLinks: true,
      ...this.dzOptions
    });

    if (typeof customInitCallback === "function") {
      customInitCallback(dz);
    }

    this.initialized = true;
    return dz;
  }
}


class ProgressBar extends Div {
  constructor(attrs = {}) {
    super({ class: 'progress', ...attrs });
    this.bar = new Div({
      class: 'progress-bar progress-bar-striped progress-bar-animated',
      role: 'progressbar',
      'aria-valuenow': 0,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      style: 'width: 0%'
    });
    this.addChild(this.bar);
  }
  
  update(value) {
    const clampedValue = Math.max(0, Math.min(100, value));
    this.bar.setAttr('aria-valuenow', clampedValue);
    this.bar.setStyle('width', `${clampedValue}%`);
  }
  
  hide() {
    this.removeClass('show');
    this.addClass('hide');
    this.update(0);
  }
  
  show() {
    this.removeClass('hide');
    this.addClass('show');
  }
}


class JsGrid extends Div {
  constructor(id, options = {}, attrs = {}) {
    super({ id, ...attrs });
    this.id = id;
    this.options = options;
  }

  init(customInitCallback = null) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.jsGrid === 'undefined') {
      console.error('jQuery or jsGrid library not found. Please ensure they are loaded.');
      return;
    }
    
    const gridElement = jQuery(`#${this.id}`);
    if (gridElement.length) {
      gridElement.jsGrid(this.options);
      
      if (typeof customInitCallback === 'function') {
        customInitCallback(gridElement);
      }
    } else {
      console.warn(`JsGrid container with ID "${this.id}" not found in the DOM.`);
    }
  }
}


class TabulatorTable extends Div {
  constructor(id, data = [], columns = [], options = {}, attrs = {}) {
    super({ id, ...attrs });
    this.id = id;
    this.data = data;
    this.columns = columns;
    this.options = options;
    this.tabulator = null;
  }

  init() {
    if (typeof Tabulator === 'undefined') {
      console.error('Tabulator library not found. Please ensure it is loaded.');
      return;
    }

    this.tabulator = new Tabulator(`#${this.id}`, {
      data: this.data,
      columns: this.columns,
      layout: "fitColumns",
      ...this.options
    });
  }
}

// Assign all classes and functions to the global scope
window.HtmlElement = HtmlElement;
window.HtmlText = HtmlText;
window.HtmlRaw = HtmlRaw;
window.Label = Label;
window.Strong = Strong;
window.I = I;
window.B = B;
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
window.Tr = Tr;
window.Th = Th;
window.Td = Td;
window.Nav = Nav;
window.Aside = Aside;
window.Main = Main;
window.Footer = Footer;
window.Ol = Ol;
window.Card = Card;
window.Badge = Badge;
window.Spinner = Spinner;
window.Accordion = Accordion;
window.AccordionItem = AccordionItem;
window.AccordionHeader = AccordionHeader;
window.AccordionBody = AccordionBody;
window.buildListGroup = buildListGroup;
window.loadAdminLTE5Deps = loadAdminLTE5Deps;
window.AdminLTEWrapper = AdminLTEWrapper;
window.AdminLTENavbar = AdminLTENavbar;
window.AdminLTESidebar = AdminLTESidebar;
window.AdminLTEContentWrapper = AdminLTEContentWrapper;
window.AdminLTEFooter = AdminLTEFooter;
window.AdminLTECard = AdminLTECard;
window.AdminLTEInfoBox = AdminLTEInfoBox;
window.AdminLTESmallBox = AdminLTESmallBox;
window.AdminLTECallout = AdminLTECallout;
window.AdminLTETable = AdminLTETable;
window.buildAdminMenu = buildAdminMenu;
window.buildAdminBreadcrumb = buildAdminBreadcrumb;
window.createElement = createElement;
window.buildTable = buildTable;
window.buildAlert = buildAlert;
window.buildForm = buildForm;
window.buildModal = buildModal;
window.DropzoneForm = DropzoneForm;
window.ProgressBar = ProgressBar;
window.JsGrid = JsGrid;
window.TabulatorTable = TabulatorTable;
