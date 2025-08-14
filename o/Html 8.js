// ===== Html.js (Refactor + Full Merge with AdminLTE 4 + Bootstrap 5) =====

// Composite Pattern Base Class
class HtmlElement {
  constructor(tag = null, attrs = {}, children = []) {
    this.tag = tag; // The HTML tag (e.g. div, span)
    this.attrs = { ...attrs }; // Element attributes (id, class, etc.)
    this.children = children || []; // Child elements
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
  addChildren(children) { children.forEach(child => this.addChild(child)); return this; }
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
  setEvent(event, handler) { this.attrs['on' + event] = handler; return this; }
  removeEvent(event) { delete this.attrs['on' + event]; return this; }

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

  // Convert to real DOM
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
      if (!Object.prototype.hasOwnProperty.call(this.attrs, key)) continue;
      const value = this.attrs[key];

      if (key === 'class') element.className = value;
      else if (key === 'id') element.id = value;
      else if (key === 'data' && typeof value === 'object') {
        for (const [dataKey, dataValue] of Object.entries(value)) {
          element.dataset[dataKey] = dataValue;
        }
      } else if (value === true) {
        element.setAttribute(key, '');
      } else if (value !== false && value !== null && value !== undefined) {
        element.setAttribute(key, value);
      }
    }

    this.children.forEach(child => {
      const childElement = child.toHtmlElement();
      if (childElement) element.appendChild(childElement);
    });

    return element;
  }

  toString() { return this.toHtml(); }

  // Helpers
  static escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  static escapeAttr(str) { return HtmlElement.escapeHtml(str).replace(/"/g, '&quot;'); }
}

// Leaf node for plain text
class HtmlText {
  constructor(text) { this.text = text; }
  toHtml() { return HtmlElement.escapeHtml(this.text); }
  toHtmlElement() { return document.createTextNode(this.text); }
}

// Leaf node for raw HTML
class HtmlRaw {
  constructor(html) { this.html = html; }
  toHtml() { return this.html; }
  toHtmlElement() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.html;
    if (tempDiv.children.length === 1) return tempDiv.firstElementChild;
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
    return fragment;
  }
}

// --- Semantic element classes ---
class Label extends HtmlElement { constructor(attrs = {}, children = []) { super('label', attrs, children); } }
class Strong extends HtmlElement { constructor(attrs = {}, children = []) { super('strong', attrs, children); } }
class I extends HtmlElement { constructor(attrs = {}, children = []) { super('i', attrs, children); } }
class B extends HtmlElement { constructor(attrs = {}, children = []) { super('b', attrs, children); } }
class H1 extends HtmlElement { constructor(attrs = {}, children = []) { super('h1', attrs, children); } }
class H2 extends HtmlElement { constructor(attrs = {}, children = []) { super('h2', attrs, children); } }
class H3 extends HtmlElement { constructor(attrs = {}, children = []) { super('h3', attrs, children); } }
class H4 extends HtmlElement { constructor(attrs = {}, children = []) { super('h4', attrs, children); } }
class H5 extends HtmlElement { constructor(attrs = {}, children = []) { super('h5', attrs, children); } }
class H6 extends HtmlElement { constructor(attrs = {}, children = []) { super('h6', attrs, children); } }
class Div extends HtmlElement { constructor(attrs = {}, children = []) { super('div', attrs, children); } }
class Span extends HtmlElement { constructor(attrs = {}, children = []) { super('span', attrs, children); } }
class Form extends HtmlElement { constructor(attrs = {}, children = []) { super('form', attrs, children); } }
class Input extends HtmlElement { constructor(type, attrs = {}) { super('input', { type, ...attrs }); } }
class Textarea extends HtmlElement { constructor(attrs = {}, children = []) { super('textarea', attrs, children); } }
class Button extends HtmlElement { constructor(attrs = {}, children = []) { super('button', attrs, children); } }
class P extends HtmlElement { constructor(attrs = {}, children = []) { super('p', attrs, children); } }
class Img extends HtmlElement { constructor(attrs = {}) { super('img', attrs); } }
class A extends HtmlElement { constructor(attrs = {}, children = []) { super('a', attrs, children); } }
class Ul extends HtmlElement { constructor(attrs = {}, children = []) { super('ul', attrs, children); } }
class Li extends HtmlElement { constructor(attrs = {}, children = []) { super('li', attrs, children); } }
class Table extends HtmlElement { constructor(attrs = {}, children = []) { super('table', attrs, children); } }
class Thead extends HtmlElement { constructor(attrs = {}, children = []) { super('thead', attrs, children); } }
class Tbody extends HtmlElement { constructor(attrs = {}, children = []) { super('tbody', attrs, children); } }
class Tr extends HtmlElement { constructor(attrs = {}, children = []) { super('tr', attrs, children); } }
class Th extends HtmlElement { constructor(attrs = {}, children = []) { super('th', attrs, children); } }
class Td extends HtmlElement { constructor(attrs = {}, children = []) { super('td', attrs, children); } }
class Nav extends HtmlElement { constructor(attrs = {}, children = []) { super('nav', attrs, children); } }
class Aside extends HtmlElement { constructor(attrs = {}, children = []) { super('aside', attrs, children); } }
class Main extends HtmlElement { constructor(attrs = {}, children = []) { super('main', attrs, children); } }
class Footer extends HtmlElement { constructor(attrs = {}, children = []) { super('footer', attrs, children); } }
class Ol extends HtmlElement { constructor(attrs = {}, children = []) { super('ol', attrs, children); } }

// --- Bootstrap 5 Component Classes / Helpers ---
class Card extends Div {
  constructor(attrs = {}, children = []) { super({ class: 'card', ...attrs }, children); }
  addHeader(headerContent) {
    const header = new Div({ class: 'card-header' });
    if (typeof headerContent === 'string') header.addChild(new H3({ class: "card-title mb-0" }).addText(headerContent));
    else header.addRawHtml(headerContent);
    this.addChild(header);
    return this;
  }
  addBody(bodyContent) {
    const body = new Div({ class: 'card-body' });
    if (typeof bodyContent === 'string') body.addRawHtml(bodyContent);
    else if (bodyContent instanceof HtmlElement) body.addChild(bodyContent);
    else if (Array.isArray(bodyContent)) {
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
  constructor(id, attrs = {}) { super({ class: 'accordion', id: id, ...attrs }); }
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
    this.addChild(new Div({ class: 'accordion-body' }).addRawHtml(
      typeof bodyContent === 'string' ? bodyContent :
      (bodyContent instanceof HtmlElement ? bodyContent.toHtml() : '')
    ));
  }
}

// --- AdminLTE 4 Loader (Bootstrap 5) ---
function loadAdminLTE5Deps(opts = {}) {
  const adminlteVersion = opts.adminlteVersion || '4.0.0';
  const deps = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/css/adminlte.min.css`,
  ];
  const scripts = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/js/adminlte.min.js`,
  ];

  deps.forEach(url => {
    if (!document.querySelector(`link[href='${url}']`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  });
  scripts.forEach(url => {
    if (!document.querySelector(`script[src='${url}']`)) {
      const s = document.createElement('script');
      s.src = url;
      document.head.appendChild(s);
    }
  });
  return { css: deps, js: scripts };
}

// Back-compat alias (old name -> new loader)
const loadAdminLTEDeps = loadAdminLTE5Deps;

// --- AdminLTE 4 Components and Widgets ---
class AdminLTEWrapper extends Div {
  constructor(attrs = {}, children = []) { super({ class: 'wrapper', ...attrs }, children); }
}

class AdminLTENavbar extends Nav {
  constructor(attrs = {}, children = []) {
    super({ class: 'main-header navbar navbar-expand navbar-white navbar-light', role: 'navigation', ...attrs }, children);
  }
  addLeftToggleButton() {
    // AdminLTE 4 uses data-lte-toggle="sidebar"
    const btn = new A({ href: '#', class: 'nav-link', 'data-lte-toggle': 'sidebar', role: 'button' })
      .addRawHtml('<i class="fas fa-bars"></i>');
    this.addChild(new Div({ class: 'navbar-nav' }).addChild(btn));
    return this;
  }
}

class AdminLTESidebar extends Aside {
  constructor(brandHtml, attrs = {}, children = []) {
    super({ class: 'main-sidebar sidebar-dark-primary elevation-4', ...attrs }, children);
    if (brandHtml) {
      const brand = new A({ href: '#', class: 'brand-link' }).addRawHtml(brandHtml);
      this.addChild(brand);
    }
    this._sidebarContent = new Div({ class: 'sidebar' });
    this.addChild(this._sidebarContent);
  }
  addUserPanel(html) {
    const up = new Div({ class: 'user-panel mt-3 pb-3 mb-3 d-flex' }).addRawHtml(html);
    this._sidebarContent.addChild(up);
    return this;
  }
  // optional; structure differs in AdminLTE 4, but keeping as utility hook
  addSearch(formHtml) {
    const form = new Div({ class: 'form-inline' }).addRawHtml(formHtml || '');
    this._sidebarContent.addChild(form);
    return this;
  }
  addMenu(menuEl) { this._sidebarContent.addChild(menuEl); return this; }
}

class AdminLTEContentWrapper extends Div {
  constructor(attrs = {}, children = []) { super({ class: 'content-wrapper', ...attrs }, children); }
  addContentHeader(title, breadcrumbEl = null) {
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
  addMainContent(el) {
    const section = new Div({ class: 'content' }).addChild(new Div({ class: 'container-fluid' }).addChild(el));
    this.addChild(section);
    return this;
  }
}

class AdminLTEFooter extends Footer {
  constructor(attrs = {}, children = []) { super({ class: 'main-footer', ...attrs }, children); }
}

class AdminLTECard extends Card {
  constructor(type = 'primary', outline = false, attrs = {}, children = []) {
    const cls = outline ? `card card-outline card-${type}` : `card card-${type}`;
    super({ class: cls, ...attrs }, children);
  }
  addTools(html) {
    const lastHeader = this.children.find(c => c.attrs && c.attrs.class && c.attrs.class.includes('card-header'));
    if (lastHeader) lastHeader.addRawHtml(`<div class="card-tools">${html}</div>`);
    return this;
  }
}

class AdminLTEInfoBox extends Div {
  constructor(iconClass, text, number, bg = 'info', attrs = {}) {
    super({ class: 'info-box', ...attrs });
    this.addChild(new Span({ class: `info-box-icon bg-${bg}` }).addRawHtml(`<i class="${iconClass}"></i>`));
    const content = new Div({ class: 'info-box-content' })
      .addChild(new Span({ class: 'info-box-text' }).addText(text))
      .addChild(new Span({ class: 'info-box-number' }).addText(number));
    this.addChild(content);
  }
}

class AdminLTESmallBox extends Div {
  constructor(number, text, iconClass = 'fa fa-chart-pie', bg = 'info', linkHref = '#', attrs = {}) {
    super({ class: `small-box bg-${bg}`, ...attrs });
    const inner = new Div({ class: 'inner' })
      .addChild(new H3().addText(String(number)))
      .addChild(new P().addText(text));
    const icon = new Div({ class: 'icon' }).addRawHtml(`<i class="${iconClass}"></i>`);
    const link = new A({ href: linkHref, class: 'small-box-footer' })
      .addRawHtml('More info <i class="fas fa-arrow-circle-right"></i>');
    this.addChild(inner).addChild(icon).addChild(link);
  }
}

class AdminLTECallout extends Div {
  constructor(title, message, type = 'info', attrs = {}) {
    super({ class: `callout callout-${type}`, ...attrs });
    if (title) this.addChild(new H5().addText(title));
    if (message) this.addChild(new P().addText(message));
  }
}

class AdminLTETable extends Table {
  constructor(attrs = {}, headers = [], rows = []) {
    super({ class: 'table table-bordered table-hover', ...attrs });
    if (headers.length) this.addChild(new Thead().addChild(new Tr().addChildren(headers.map(h => new Th().addText(h)))));
    const tb = new Tbody();
    rows.forEach(row => tb.addChild(new Tr().addChildren(row.map(c => new Td().addText(c)))));
    this.addChild(tb);
  }
}

function buildAdminBreadcrumb(items = []) {
  const ol = new Ol({ class: 'breadcrumb float-sm-end' }); // BS5: float-sm-end
  items.forEach(it => ol.addChild(
    new Li({ class: 'breadcrumb-item' })
      .addChild(it.href ? new A({ href: it.href }).addText(it.text) : new Span().addText(it.text))
  ));
  return new Div({ class: 'container-fluid' }).addChild(new Div({ class: 'row mb-2' })
    .addChild(new Div({ class: 'col-sm-6' }))
    .addChild(new Div({ class: 'col-sm-6' }).addChild(ol)));
}

function buildAdminMenu(items = []) {
  const nav = new Nav({ class: 'mt-2' });
  // AdminLTE 4 treeview works without jQuery; keep simple structure
  const ul = new Ul({ class: 'nav nav-pills nav-sidebar flex-column', role: 'menu', 'data-accordion': 'false' });

  function makeItem(it) {
    const li = new Li({ class: 'nav-item' });
    if (it.children && it.children.length) {
      const a = new A({ href: '#', class: 'nav-link' })
        .addRawHtml(`<i class="nav-icon ${it.icon || 'far fa-circle'}"></i><p>${it.text}<i class="right fas fa-angle-left"></i></p>`);
      const innerUl = new Ul({ class: 'nav nav-treeview' });
      it.children.forEach(c => innerUl.addChild(makeItem(c)));
      li.addChild(a).addChild(innerUl);
    } else {
      const a = new A(
        { href: it.href || '#', class: `nav-link ${it.active ? 'active' : ''}` }
      ).addRawHtml(
        `<i class="nav-icon ${it.icon || 'far fa-circle'}"></i><p>${it.text}` +
        `${it.badge ? `<span class="right badge badge-${it.badge.type || 'danger'}">${it.badge.text}</span>` : ''}</p>`
      );
      li.addChild(a);
    }
    return li;
  }

  items.forEach(i => ul.addChild(makeItem(i)));
  nav.addChild(ul);
  return nav;
}

// AdminLTE 4 no jQuery requirement; keep as optional hook
function initAdminLTEWidgets() { /* no-op for AdminLTE 4; place custom init here if needed */ }

// --- Helper builders and utilities ---
function buildListGroup(items, type = 'ul', attrs = {}) {
  const listContainer = type === 'ul' ? new Ul({ class: 'list-group', ...attrs }) : new Div({ class: 'list-group', ...attrs });
  items.forEach(item => {
    const itemAttrs = { class: 'list-group-item' };
    if (item.active) itemAttrs.class += ' active';
    if (item.disabled) itemAttrs.class += ' disabled';
    let listItem;
    if (item.href) listItem = new A({ ...itemAttrs, class: itemAttrs.class + ' list-group-item-action', href: item.href });
    else listItem = new Li(itemAttrs);
    listItem.addText(item.text);
    listContainer.addChild(listItem);
  });
  return listContainer;
}

function buildTable(headers, rows) {
  const thead = new Thead().addChild(new Tr().addChild(...headers.map(h => new Th().addText(h))));
  const tbody = new Tbody();
  rows.forEach(row => tbody.addChild(new Tr().addChild(...row.map(cell => new Td().addText(cell)))));
  return new Table({ class: 'table table-bordered' }).addChild(thead).addChild(tbody).toHtml();
}

function buildAlert(type, message) {
  return new Div({ class: `alert alert-${type}`, role: 'alert' }).addText(message).toHtml();
}

function buildForm(fields, submitText = 'Submit') {
  const form = new Form({ class: 'form' });
  fields.forEach(field => {
    const group = new Div({ class: 'mb-3' });
    let inputElement;
    if (field.type === 'textarea') {
      inputElement = new Textarea({ class: 'form-control', id: field.id, placeholder: field.placeholder || '' });
    } else {
      inputElement = new Input(field.type, { class: 'form-control', id: field.id, placeholder: field.placeholder || '' });
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
            .addChild(
              new Div({ class: 'modal-header' })
                .addChild(new Div({ class: 'modal-title h5' }).addText(title))
                .addChild(new Button({ type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' }))
            )
            .addChild(new Div({ class: 'modal-body' }).addChild(new Div().addText(body)))
            .addChild(
              new Div({ class: 'modal-footer' })
                .addChild(new Button({ type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }).addText('Close'))
            )
        )
    ).toHtml();
}

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') el.className = value;
    else el.setAttribute(key, value);
  }
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  });
  return el;
}

// --- Third-party Integrations ---
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
    if (typeof customInitCallback === "function") customInitCallback(dz);
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
  hide() { this.removeClass('show'); this.addClass('hide'); this.update(0); }
  show() { this.removeClass('hide'); this.addClass('show'); }
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
      if (typeof customInitCallback === 'function') customInitCallback(gridElement);
    } else {
      console.warn(`JsGrid container with ID "${this.id}" not found in the DOM.`);
    }
  }
}

class TabulatorTable extends Div {
  constructor(id, data = [], columns = [], options = {}, attrs = {}) {
    super({ id, ...attrs });
    this.id = id;
    this.data = Array.isArray(data) ? data : [];
    this.columns = Array.isArray(columns) ? columns : [];
    this.options = options || {};
    this.tabulator = null;
  }
  render() { return `<div id="${this.id}" ${this.renderAttrs ? this.renderAttrs() : ''}></div>`; }
  mount() {
    const el = document.getElementById(this.id);
    if (!el) { console.error(`TabulatorTable.mount(): element #${this.id} not found`); return; }
    if (typeof Tabulator === 'undefined') { console.error('Tabulator library not found. Please ensure it is loaded.'); return; }
    try {
      this.tabulator = new Tabulator(el, {
        data: this.data,
        columns: this.columns,
        layout: "fitColumns",
        reactiveData: false,
        ...this.options,
      });
    } catch (err) { console.error('Failed to create Tabulator instance:', err); }
  }
  setData(data = []) { this.data = Array.isArray(data) ? data : []; if (this.tabulator) this.tabulator.setData(this.data); return this; }
  setColumns(columns = []) { this.columns = Array.isArray(columns) ? columns : []; if (this.tabulator) this.tabulator.setColumns(this.columns); return this; }
  getInstance() { return this.tabulator; }
  destroy() { if (this.tabulator) { this.tabulator.destroy(); this.tabulator = null; } }
}

/* ==== Embedded Flow.js-lite (API-compatible subset) ==== */
(function(global){
  function EventEmitter(){ this._events = {}; }
  EventEmitter.prototype.on = function(name, fn){ (this._events[name]||(this._events[name]=[])).push(fn); return this; };
  EventEmitter.prototype.off = function(name, fn){
    if(!this._events[name]) return this;
    if(!fn){ delete this._events[name]; return this; }
    this._events[name] = this._events[name].filter(f=>f!==fn); return this;
  };
  EventEmitter.prototype.emit = function(name){
    var args = Array.prototype.slice.call(arguments,1);
    (this._events[name]||[]).slice().forEach(fn=>{ try{ fn.apply(null,args);}catch(e){ console.error(e);} });
  };

  function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function sliceBlob(blob, start, end){ return blob.slice ? blob.slice(start,end) : blob.webkitSlice(start,end); }

  function FlowFile(flow, file, relativePath){
    this.flow = flow;
    this.file = file;
    this.name = file.name;
    this.size = file.size;
    this.relativePath = relativePath || file.webkitRelativePath || file.name;
    this.uniqueIdentifier = (flow.opts.generateUniqueIdentifier || function(file){
      return (file.size + '-' + (file.name||'').replace(/[^0-9a-zA-Z_-]/g,'') + '-' + uid());
    })(file, this);
    this.chunks = [];
    this._paused = false;
    this._completed = false;
    this._errored = false;
    this._progress = 0;
    var chunkSize = flow.opts.chunkSize;
    var offset = 0, index = 0;
    while(offset < this.size){
      var end = Math.min(this.size, offset + chunkSize);
      this.chunks.push(new FlowChunk(this, index++, offset, end));
      offset = end;
    }
  }
  FlowFile.prototype.pause = function(){ this._paused = true; };
  FlowFile.prototype.resume = function(){ this._paused = false; };
  FlowFile.prototype.isComplete = function(){ return this._completed; };
  FlowFile.prototype.isPaused = function(){ return this._paused; };
  FlowFile.prototype.progress = function(){ return this._progress; };
  FlowFile.prototype._recomputeProgress = function(){
    var done = 0;
    for(var i=0;i<this.chunks.length;i++){ done += this.chunks[i].progress(); }
    this._progress = done / this.chunks.length;
  };

  function FlowChunk(flowFile, index, start, end){
    this.flowFile = flowFile;
    this.index = index+1; // 1-based
    this.start = start;
    this.end = end;
    this.size = end - start;
    this._loaded = 0;
    this._sent = false;
    this._success = false;
    this._error = false;
    this._xhr = null;
  }
  FlowChunk.prototype.progress = function(){
    if(this._success) return 1;
    if(this._error) return 0;
    return this.size ? (this._loaded / this.size) : 0;
  };
  FlowChunk.prototype.abort = function(){ try{ if(this._xhr) this._xhr.abort(); }catch(e){} };
  FlowChunk.prototype.send = function(cb){
    var self = this, file = self.flowFile.file, flow = self.flowFile.flow, o = flow.opts;
    var blob = sliceBlob(file, self.start, self.end);
    var params = Object.assign({}, (typeof o.query==='function'?o.query(self):o.query)||{}, {
      chunkNumber: self.index,
      chunkSize: o.chunkSize,
      currentChunkSize: blob.size,
      totalSize: file.size,
      identifier: self.flowFile.uniqueIdentifier,
      filename: self.flowFile.name,
      relativePath: self.flowFile.relativePath,
      totalChunks: self.flowFile.chunks.length
    });

    var form = new FormData();
    Object.keys(params).forEach(k=>form.append(k, params[k]));
    form.append(o.fileParameterName, blob, self.flowFile.name);

    var xhr = new XMLHttpRequest();
    self._xhr = xhr;
    xhr.open(o.method || 'POST', o.target, true);

    var headers = (typeof o.headers==='function'?o.headers(self):o.headers)||{};
    Object.keys(headers).forEach(k=>xhr.setRequestHeader(k, headers[k]));

    xhr.upload.onprogress = function(e){
      if(e.lengthComputable){
        self._loaded = e.loaded;
        self.flowFile._recomputeProgress();
        flow.emit('fileProgress', self.flowFile, self);
        flow.emit('progress');
      }
    };
    xhr.onreadystatechange = function(){
      if(xhr.readyState===4){
        if(xhr.status>=200 && xhr.status<300){
          self._success = true;
          self._sent = true;
          flow.emit('chunkSuccess', self.flowFile, self, xhr);
          var allOk = self.flowFile.chunks.every(c=>c._success);
          self.flowFile._recomputeProgress();
          flow.emit('fileProgress', self.flowFile, self);
          if(allOk){
            self.flowFile._completed = true;
            flow.emit('fileSuccess', self.flowFile, xhr);
            var allFilesOk = flow.files.every(f=>f.isComplete());
            if(allFilesOk) flow.emit('complete');
          }
          cb && cb(null);
        }else{
          self._error = true;
          flow.emit('chunkError', self.flowFile, self, xhr);
          flow.emit('fileError', self.flowFile, xhr);
          cb && cb(new Error('HTTP '+xhr.status));
        }
      }
    };
    xhr.onerror = function(){
      self._error = true;
      flow.emit('chunkError', self.flowFile, self, xhr);
      flow.emit('fileError', self.flowFile, xhr);
      cb && cb(new Error('network error'));
    };
    xhr.send(form);
  };

  function Flow(opts){
    this.opts = Object.assign({
      target: '/upload',
      singleFile: false,
      fileParameterName: 'file',
      chunkSize: 1024*1024, // 1MB
      simultaneousUploads: 3,
      method: 'POST',
      query: {},
      headers: {},
      testChunks: false
    }, opts||{});
    this.files = [];
    this._emitter = new EventEmitter();
    this._processing = false;
  }
  Flow.prototype.on = function(n, fn){ this._emitter.on(n, fn); return this; };
  Flow.prototype.off = function(n, fn){ this._emitter.off(n, fn); return this; };
  Flow.prototype.emit = function(){ this._emitter.emit.apply(this._emitter, arguments); };
  Flow.prototype.addFile = function(file, relativePath){
    var f = new FlowFile(this, file, relativePath);
    if(this.opts.singleFile) this.files = [f]; else this.files.push(f);
    this.emit('fileAdded', f);
    this.emit('filesSubmitted', [f]);
    return f;
  };
  Flow.prototype.addFiles = function(fileList){
    var arr = Array.prototype.slice.call(fileList);
    var added = arr.map(f=>this.addFile(f));
    this.emit('filesSubmitted', added);
    return added;
  };
  Flow.prototype.assignBrowse = function(domNode, isDirectory, multiple){
    var input = document.createElement('input');
    input.type = 'file';
    if(multiple!==false && !this.opts.singleFile) input.multiple = true;
    if(isDirectory){ input.setAttribute('webkitdirectory',''); }
    input.style.display = 'none';
    domNode._flowBrowseInput = input;
    domNode.addEventListener('click', function(){ input.value=''; input.click(); });
    var self = this;
    input.addEventListener('change', function(e){
      if(e.target.files && e.target.files.length){
        self.addFiles(e.target.files);
        self.emit('browse', e.target.files);
      }
    });
    document.body.appendChild(input);
  };
  Flow.prototype.assignDrop = function(domNode){
    var self = this;
    domNode.addEventListener('dragover', function(e){ e.preventDefault(); domNode.classList.add('is-dragover'); });
    domNode.addEventListener('dragleave', function(e){ domNode.classList.remove('is-dragover'); });
    domNode.addEventListener('drop', function(e){
      e.preventDefault();
      domNode.classList.remove('is-dragover');
      if(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length){
        self.addFiles(e.dataTransfer.files);
      }
    });
  };
  Flow.prototype.upload = function(){
    var self = this;
    if(this._processing) return;
    this._processing = true;
    function pump(){
      if(!self._processing) return;
      var inFlight = 0;
      for(var i=0;i<self.files.length;i++){
        var f = self.files[i];
        if(f.isPaused() || f.isComplete()) continue;
        var next = f.chunks.find(c=>!c._sent && !c._success && !c._error);
        while(next && inFlight < self.opts.simultaneousUploads){
          inFlight++;
          (function(chunk){
            chunk.send(function(){
              inFlight--;
              pump();
            });
          })(next);
          next = f.chunks.find(c=>!c._sent && !c._success && !c._error);
        }
      }
      var hasPending = self.files.some(f=>f.chunks.some(c=>!c._success && !c._error));
      if(!hasPending && inFlight===0){ self._processing = false; }
    }
    pump();
  };
  Flow.prototype.pause = function(){
    this._processing = false;
    this.files.forEach(f=>f.pause());
  };
  Flow.prototype.resume = function(){
    this.files.forEach(f=>f.resume());
    this.upload();
  };
  Flow.prototype.cancel = function(){
    this._processing = false;
    this.files.forEach(function(f){ f.chunks.forEach(c=>c.abort()); });
  };
  Flow.prototype.removeFile = function(flowFile){ this.files = this.files.filter(f=>f!==flowFile); };

  global.Flow = Flow;
})(window);


// --- Blueimp jQuery File Upload Form ---
class BlueimpFileUploadForm extends Form {
  constructor(id, options = {}, children = []) {
    super({ id, class: "fileupload", action: options.url || "/", method: "POST", enctype: "multipart/form-data" }, children);
    this.id = id;
    this.options = options;
    this.progressBar = null;

    // Default UI: Button + File Input + Progress
    const fileInputId = id + "-input";
    this.addChild(
      new Div({ class: "mb-3" }, [
        new Input("file", { name: "files[]", id: fileInputId, multiple: options.multiple ?? true, class: "form-control" })
      ])
    );

    this.progressBar = new ProgressBar();
    this.addChild(
      new Div({ class: "mb-3" }, [
        new Label({}, [new HtmlText("Upload Progress")]),
        this.progressBar
      ])
    );
  }

  mount(container) {
    const el = this.toHtmlElement();
    container.appendChild(el);
    this.initFileUpload();
    return el;
  }

  initFileUpload(customInitCallback = null) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.fileupload === 'undefined') {
      console.error('jQuery File Upload plugin not found. Please load it before initializing.');
      return;
    }

    const opts = Object.assign({
      dataType: 'json',
      add: (e, data) => { data.submit(); },
      progressall: (e, data) => {
        const progress = parseInt(data.loaded / data.total * 100, 10);
        this.progressBar.update(progress);
      },
      done: (e, data) => { console.log('Upload complete:', data.result); },
      fail: (e, data) => { console.error('Upload failed:', data.errorThrown); }
    }, this.options);

    jQuery(`#${this.id} input[type=file]`).fileupload(opts);

    if (typeof customInitCallback === 'function') {
      customInitCallback(jQuery(`#${this.id}`));
    }
  }
}


/* ==== HtmlFlowUploader (UI using HtmlElement system) ==== */
class HtmlFlowUploader extends HtmlElement {
  constructor(options = {}){
    super('div', { class: 'flow-uploader' }, []);
    const defaults = {
      target: '/upload',
      singleFile: false,
      chunkSize: 1024*1024,
      simultaneousUploads: 3,
      method: 'POST',
      accept: '*/*',
      dropText: 'Drop files here',
      buttonText: 'Select files',
      startText: 'Start upload',
      pauseText: 'Pause',
      resumeText: 'Resume',
      cancelText: 'Cancel',
      showList: true
    };
    this.opts = Object.assign({}, defaults, options || {});
    this._ids = {
      drop: 'drop-' + Math.random().toString(36).slice(2),
      btn: 'btn-' + Math.random().toString(36).slice(2),
      list: 'list-' + Math.random().toString(36).slice(2),
      start: 'start-' + Math.random().toString(36).slice(2),
      pause: 'pause-' + Math.random().toString(36).slice(2),
      resume: 'resume-' + Math.random().toString(36).slice(2),
      cancel: 'cancel-' + Math.random().toString(36).slice(2),
    };
    this._flow = null;

    // Build UI
    this
      .addChild(new HtmlElement('div', { id: this._ids.drop, class: 'flow-dropzone' }, [
        new HtmlElement('p', {}, [ new HtmlText(this.opts.dropText) ])
      ]))
      .addChild(new HtmlElement('div', { class: 'flow-controls' }, [
        new HtmlElement('button', { id: this._ids.btn, type: 'button', class: 'flow-btn-browse' }, [ new HtmlText(this.opts.buttonText) ]),
        new HtmlElement('button', { id: this._ids.start, type: 'button', class: 'flow-btn-start' }, [ new HtmlText(this.opts.startText) ]),
        new HtmlElement('button', { id: this._ids.pause, type: 'button', class: 'flow-btn-pause' }, [ new HtmlText(this.opts.pauseText) ]),
        new HtmlElement('button', { id: this._ids.resume, type: 'button', class: 'flow-btn-resume' }, [ new HtmlText(this.opts.resumeText) ]),
        new HtmlElement('button', { id: this._ids.cancel, type: 'button', class: 'flow-btn-cancel' }, [ new HtmlText(this.opts.cancelText) ]),
      ]));

    if(this.opts.showList){
      this.addChild(new HtmlElement('ul', { id: this._ids.list, class: 'flow-file-list' }, []));
    }
  }

  mount(container){
    const el = this.toHtmlElement();
    container.appendChild(el);
    this._initFlow(el);
    return el;
  }

  _initFlow(root){
    const drop = root.querySelector('#'+this._ids.drop);
    const btn = root.querySelector('#'+this._ids.btn);
    const list = root.querySelector('#'+this._ids.list);
    const startBtn = root.querySelector('#'+this._ids.start);
    const pauseBtn = root.querySelector('#'+this._ids.pause);
    const resumeBtn = root.querySelector('#'+this._ids.resume);
    const cancelBtn = root.querySelector('#'+this._ids.cancel);

    const flow = new Flow({
      target: this.opts.target,
      singleFile: this.opts.singleFile,
      chunkSize: this.opts.chunkSize,
      simultaneousUploads: this.opts.simultaneousUploads,
      method: this.opts.method,
      query: this.opts.query || {},
      headers: this.opts.headers || {},
      fileParameterName: this.opts.fileParameterName || 'file'
    });
    this._flow = flow;

    flow.assignDrop(drop);
    flow.assignBrowse(btn, false, !this.opts.singleFile);

    const renderFileItem = (f)=>{
      const li = document.createElement('li');
      li.className = 'flow-file-item';
      li.innerHTML = `
        <div class="flow-file-name">${f.name}</div>
        <div class="flow-file-progress"><div class="bar" style="width:0%"></div></div>
        <div class="flow-file-size">${(f.size/1024/1024).toFixed(2)} MB</div>
      `;
      li._bar = li.querySelector('.bar');
      li._update = function(){ li._bar.style.width = Math.round(f.progress()*100) + '%'; };
      return li;
    };

    const fileNodes = new Map();

    flow.on('fileAdded', function(file){
      if(list){
        const node = renderFileItem(file);
        list.appendChild(node);
        fileNodes.set(file, node);
      }
    });

    flow.on('fileProgress', function(file){
      const node = fileNodes.get(file);
      if(node && node._update) node._update();
    });

    flow.on('fileSuccess', function(file, xhr){
      const node = fileNodes.get(file);
      if(node){
        node.classList.add('success');
        node._bar.style.width = '100%';
      }
    });

    flow.on('fileError', function(file, xhr){
      const node = fileNodes.get(file);
      if(node){ node.classList.add('error'); }
    });

    startBtn && startBtn.addEventListener('click', ()=>flow.upload());
    pauseBtn && pauseBtn.addEventListener('click', ()=>flow.pause());
    resumeBtn && resumeBtn.addEventListener('click', ()=>flow.resume());
    cancelBtn && cancelBtn.addEventListener('click', ()=>flow.cancel());
  }
}

// --- Exporting to global scope ---
const exports = {
  // Base classes
  HtmlElement, HtmlText, HtmlRaw,
  // Standard HTML elements
  Label, Strong, I, B, H1, H2, H3, H4, H5, H6,
  Div, Span, Form, Input, Textarea, Button, P, Img, A,
  Ul, Li, Ol, Table, Thead, Tbody, Tr, Th, Td,
  // Bootstrap 5 components
  Card, Badge, Spinner, Accordion, AccordionItem, AccordionHeader, AccordionBody,
  buildListGroup,
  // AdminLTE 4 components (Bootstrap 5)
  loadAdminLTE5Deps, loadAdminLTEDeps, // alias retained for back-compat
  AdminLTEWrapper, AdminLTENavbar, AdminLTESidebar, AdminLTEContentWrapper, AdminLTEFooter,
  AdminLTECard, AdminLTEInfoBox, AdminLTESmallBox, AdminLTECallout, AdminLTETable,
  buildAdminBreadcrumb, buildAdminMenu, initAdminLTEWidgets,
  // Helper builders and utilities
  buildTable, buildAlert, buildForm, buildModal, createElement,
  // Third-party integrations
  DropzoneForm, ProgressBar, JsGrid, TabulatorTable,
  // Flow uploader UI
  HtmlFlowUploader
};

for (const key in exports) {
  if (Object.prototype.hasOwnProperty.call(exports, key)) {
    window[key] = exports[key];
  }
}



// ===== Merged Upload.js Logic =====
// Integrated from original Upload.js to make Html.js self-contained

// Html.js - Reusable Blueimp File Upload Integration (Local Storage Mode)
// Uses UniversalStorage.js for offline persistence

(function (global) {
    /**
     * Initialize a reusable Blueimp File Uploader in local mode
     * @param {Object} options
     * @param {string} options.selector - File input selector (e.g., '#fileupload')
     * @param {string} [options.storageKey] - Key for UniversalStorage
     * @param {string} options.progressSelector - Selector for progress bar element
     * @param {string} options.filesContainerSelector - Selector for uploaded files container
     * @param {string} [options.clearBtnSelector] - Selector for a "Clear All" button
     */
    function initUploader(options) {
        if (!$(options.selector).length) {
            console.error(`Uploader element ${options.selector} not found`);
            return;
        }
        if (typeof UniversalStorage === 'undefined') {
            console.error('UniversalStorage.js not loaded');
            return;
        }

        let storage = new UniversalStorage(options.storageKey || 'uploads');
        let storedFiles = storage.get('files') || [];

        // Render stored files on startup
        storedFiles.forEach(file => appendFile(file));

        $(options.selector).fileupload({
            dataType: 'json',
            add: function (e, data) {
                data.files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        const fileData = {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            dataURL: evt.target.result
                        };
                        storedFiles.push(fileData);
                        storage.set('files', storedFiles);
                        appendFile(fileData);
                    };
                    reader.readAsDataURL(file);
                });
            },
            progressall: function (e, data) {
                let progress = parseInt((data.loaded / data.total) * 100, 10);
                $(options.progressSelector).css('width', progress + '%');
                if (progress >= 100) {
                    setTimeout(() => $(options.progressSelector).css('width', '0%'), 800);
                }
            }
        });

        if (options.clearBtnSelector) {
            $(options.clearBtnSelector).on('click', function () {
                storedFiles = [];
                storage.set('files', storedFiles);
                $(options.filesContainerSelector).empty();
                $(options.progressSelector).css('width', '0%');
            });
        }

        function appendFile(file) {
            const link = $('<a/>', {
                href: file.dataURL,
                download: file.name,
                text: file.name,
                target: '_blank'
            });
            $(options.filesContainerSelector).append($('<p/>').append(link));
        }
    }

    // Expose globally
    global.initUploader = initUploader;

})(window);

// Example init on DOM ready
$(function () {
    initUploader({
        selector: '#fileupload',
        storageKey: 'localUploads',
        progressSelector: '#progress .progress-bar',
        filesContainerSelector: '#files',
        clearBtnSelector: '#clearUploads'
    });

    // Ace Editor setup (optional guard)
    if (window.ace && $('#htmlStringInput').length) {
        const editor = ace.edit("htmlStringInput");
        editor.setTheme("ace/theme/github");
        editor.session.setMode("ace/mode/javascript");

        $('#addHtmlBtn').on('click', function () {
            const code = editor.getValue();
            if (code.trim()) console.log("User JS:", code);
        });

        $('#newAgainButton').on('click', function () {
            editor.setValue('');
        });
    }
});

