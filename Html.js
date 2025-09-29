// ===== Html.js (Refactor + Full Merge with AdminLTE 4 + Bootstrap 5 + Gold Gradient Theme) =====

// ----------------------------------------------------
// Custom Gold Gradient CSS
// ----------------------------------------------------
function getCustomGoldGradientCSS() {
  return `
    /* Custom CSS for Gold Gradient Theme */
    .bg-gold-gradient {
      /* Bold Gold Gradient */
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important; 
      color: #fff !important;
      border-color: #FFD700 !important;
    }

    .card-header.bg-gold-gradient strong {
      font-weight: 800; /* Bold title */
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    .btn-primary.bg-gold-gradient,
    .btn-primary.bg-gold-gradient:hover,
    .btn-primary.bg-gold-gradient:focus {
      /* Nice Colorful Gradient Button */
      background: linear-gradient(90deg, #FFC720 0%, #FF9A00 100%) !important;
      border-color: #FF9A00 !important;
      font-weight: bold;
      color: #fff !important;
    }

    /* Light Colorful Gradient Input Focus */
    .form-control:focus, 
    .form-select:focus, 
    .form-check-input:focus {
      border-color: #FFD700;
      box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.4); 
    }
    
    /* Light Colorful Gradient Active Tab */
    .nav-tabs .nav-link.active {
      background: linear-gradient(45deg, #FFC720 0%, #FFA500 100%) !important;
      color: #fff !important;
      border-color: #FFA500 !important;
    }

    /* Ensure white background for body */
    body {
      background-color: #ffffff !important;
    }
  `;
}


// ----------------------------------------------------
// Composite Pattern Base Class
// ----------------------------------------------------
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
    const currentClass = this.attrs.class || '';
    const classes = new Set(currentClass.split(' ').filter(c => c));
    classes.add(className);
    this.attrs.class = Array.from(classes).join(' ');
    return this;
  }
  removeClass(className) {
    const currentClass = this.attrs.class || '';
    const classes = new Set(currentClass.split(' ').filter(c => c && c !== className));
    this.attrs.class = Array.from(classes).join(' ');
    return this;
  }
  hasClass(className) {
    return (this.attrs.class || '').split(' ').includes(className);
  }

  // Rendering
  _renderAttrs() {
    return Object.entries(this.attrs)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }

  _renderChildren() {
    return this.children.map(child => child.render()).join('');
  }

  render() {
    if (!this.tag) return this._renderChildren(); // Handles fragment/wrapper
    const attrsStr = this._renderAttrs();
    return `<${this.tag}${attrsStr ? ' ' + attrsStr : ''}>${this._renderChildren()}</${this.tag}>`;
  }
}

// ----------------------------------------------------
// Basic Element Wrappers
// ----------------------------------------------------

class HtmlText extends HtmlElement {
  constructor(text) {
    super(null, {}, []); // No tag, no attrs
    this.text = text;
  }
  render() {
    return String(this.text);
  }
}

class HtmlRaw extends HtmlElement {
  constructor(html) {
    super(null, {}, []); // No tag, no attrs
    this.html = html;
  }
  render() {
    return String(this.html);
  }
}

// Common HTML elements
class Div extends HtmlElement { constructor(attrs = {}, children = []) { super('div', attrs, children); } }
class Span extends HtmlElement { constructor(attrs = {}, children = []) { super('span', attrs, children); } }
class Form extends HtmlElement { constructor(attrs = {}, children = []) { super('form', attrs, children); } }
class Input extends HtmlElement { constructor(attrs = {}, children = []) { super('input', attrs, children); } }
class Textarea extends HtmlElement { constructor(attrs = {}, children = []) { super('textarea', attrs, children); } }
class Button extends HtmlElement { constructor(attrs = {}, children = []) { super('button', attrs, children); } }
class P extends HtmlElement { constructor(attrs = {}, children = []) { super('p', attrs, children); } }
class Img extends HtmlElement { constructor(attrs = {}, children = []) { super('img', attrs, children); } }
class A extends HtmlElement { constructor(attrs = {}, children = []) { super('a', attrs, children); } }
class Ul extends HtmlElement { constructor(attrs = {}, children = []) { super('ul', attrs, children); } }
class Li extends HtmlElement { constructor(attrs = {}, children = []) { super('li', attrs, children); } }
class Ol extends HtmlElement { constructor(attrs = {}, children = []) { super('ol', attrs, children); } }
class Table extends HtmlElement { constructor(attrs = {}, children = []) { super('table', attrs, children); } }
class Thead extends HtmlElement { constructor(attrs = {}, children = []) { super('thead', attrs, children); } }
class Tbody extends HtmlElement { constructor(attrs = {}, children = []) { super('tbody', attrs, children); } }
class Tr extends HtmlElement { constructor(attrs = {}, children = []) { super('tr', attrs, children); } }
class Th extends HtmlElement { constructor(attrs = {}, children = []) { super('th', attrs, children); } }
class Td extends HtmlElement { constructor(attrs = {}, children = []) { super('td', attrs, children); } }

// Typography and Labels
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

// Semantic/Layout
class Nav extends HtmlElement { constructor(attrs = {}, children = []) { super('nav', attrs, children); } }
class Aside extends HtmlElement { constructor(attrs = {}, children = []) { super('aside', attrs, children); } }
class Main extends HtmlElement { constructor(attrs = {}, children = []) { super('main', attrs, children); } }
class Footer extends HtmlElement { constructor(attrs = {}, children = []) { super('footer', attrs, children); } }

// ----------------------------------------------------
// Bootstrap & AdminLTE 5/4 Components
// ----------------------------------------------------

class Card extends Div {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' card' }, children);
  }

  addHeader(headerContent) {
    const header = new Div({ class: 'card-header' });
    if (typeof headerContent === 'string') {
      header.addChild(new H3({ class: 'card-title' }).addText(headerContent));
    } else if (headerContent instanceof HtmlElement) {
      header.addChild(headerContent);
    }
    this.children.unshift(header);
    return this;
  }
  
  addBody(bodyContent) {
    const body = new Div({ class: 'card-body' });
    if (Array.isArray(bodyContent)) body.addChildren(bodyContent);
    else body.addChild(bodyContent);
    this.addChild(body);
    return this;
  }
}

class Badge extends Span {
  constructor(text, color = 'primary', attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ` badge bg-${color}` });
    this.addText(text);
  }
}

class Spinner extends Div {
  constructor(type = 'border', color = 'primary', attrs = {}) {
    super({
      ...attrs,
      role: 'status',
      class: (attrs.class || '') + ` spinner-${type} text-${color}`
    });
    this.addChild(new Span({ class: 'visually-hidden' }).addText('Loading...'));
  }
}

// Accordion
class Accordion extends Div {
  constructor(id, attrs = {}, children = []) {
    super({ ...attrs, id: id, class: (attrs.class || '') + ' accordion' }, children);
  }
}

class AccordionItem extends Div {
  constructor(id, parentId, attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' accordion-item' }, children);
    this.id = id;
    this.parentId = parentId;
  }
}

class AccordionHeader extends H2 {
  constructor(id, parentId, title, expanded = false, attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ' accordion-header' });
    const button = new Button({
      type: 'button',
      class: 'accordion-button' + (expanded ? '' : ' collapsed'),
      'data-bs-toggle': 'collapse',
      'data-bs-target': `#collapse${id}`,
      'aria-expanded': expanded ? 'true' : 'false',
      'aria-controls': `collapse${id}`
    }).addText(title);
    this.addChild(button);
  }
}

class AccordionBody extends Div {
  constructor(id, parentId, content, expanded = false, attrs = {}) {
    super({
      ...attrs,
      id: `collapse${id}`,
      class: 'accordion-collapse collapse' + (expanded ? ' show' : ''),
      'data-bs-parent': `#${parentId}`
    });
    this.addChild(new Div({ class: 'accordion-body' }).addChildren(Array.isArray(content) ? content : [content]));
  }
}

// ----------------------------------------------------
// AdminLTE 4 Components
// ----------------------------------------------------

class AdminLTECard extends Card {
  constructor(color = 'white', outline = false, attrs = {}, children = []) {
    const baseClasses = 'card' + (outline ? ' card-outline' : '');
    super({
      ...attrs,
      class: (attrs.class || '') + ` ${baseClasses} card-${color}`
    }, children);
  }
}

/**
 * NEW: Bold Gold Gradient Title Card
 */
class AdminLTEGoldCard extends Card { 
  constructor(title, attrs = {}, children = []) {
    // White body and outline for clean look
    super({ ...attrs, class: (attrs.class || '') + ' card card-outline card-light' }); 

    // 1. Gold Gradient Header (Title Card)
    if (title) {
      const header = new Div({ class: 'card-header bg-gold-gradient' });
      
      let titleContent;
      if (typeof title === 'string') {
        // Use Strong for the requested bold title look
        titleContent = new Strong({ class: "card-title mb-0" }).addText(title);
      } else if (title instanceof HtmlElement) {
        titleContent = title;
      }
      header.addChild(titleContent);
      this.addChild(header);
    }

    // 2. White Body
    const body = new Div({ class: 'card-body' });
    if (Array.isArray(children)) {
      body.addChildren(children);
    }
    this.addChild(body);
  }
}

class AdminLTEInfoBox extends Div {
  constructor(color, iconClass, title, text, progress = 0, attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ' info-box' });
    this.addChild(new Span({ class: `info-box-icon bg-${color} elevation-1` }).addChild(new I({ class: iconClass })));
    const content = new Div({ class: 'info-box-content' });
    content.addChild(new Span({ class: 'info-box-text' }).addText(title));
    content.addChild(new Span({ class: 'info-box-number' }).addText(text));
    if (progress > 0) {
      const progressContainer = new Div({ class: 'progress' });
      progressContainer.addChild(new Div({
        class: 'progress-bar',
        style: `width: ${progress}%`
      }));
      content.addChild(progressContainer);
      content.addChild(new Span({ class: 'progress-description' }).addText(`${progress}% Increase in 30 Days`));
    }
    this.addChild(content);
  }
}

class AdminLTESmallBox extends Div {
  constructor(color, iconClass, title, text, link = '#', attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ` small-box bg-${color}` });
    const inner = new Div({ class: 'inner' });
    inner.addChild(new H3().addText(text));
    inner.addChild(new P().addText(title));
    const icon = new Div({ class: 'icon' }).addChild(new I({ class: iconClass }));
    const footer = new A({ href: link, class: 'small-box-footer' }).addText('More info ').addChild(new I({ class: 'fas fa-arrow-circle-right' }));
    this.addChildren([inner, icon, footer]);
  }
}

class AdminLTECallout extends Div {
  constructor(color, title, content, attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ` callout callout-${color}` });
    this.addChild(new H5().addText(title));
    this.addChildren(Array.isArray(content) ? content : [content]);
  }
}

class AdminLTETable extends Table {
  constructor(headers, data = [], bordered = true, hover = true, attrs = {}) {
    const classes = ['table'];
    if (bordered) classes.push('table-bordered');
    if (hover) classes.push('table-hover');
    super({ ...attrs, class: (attrs.class || '') + ' ' + classes.join(' ') });

    // Thead
    const thead = new Thead();
    const trHead = new Tr();
    headers.forEach(h => trHead.addChild(new Th().addText(h)));
    thead.addChild(trHead);
    this.addChild(thead);

    // Tbody
    const tbody = new Tbody();
    data.forEach(rowData => {
      const trBody = new Tr();
      rowData.forEach(cellData => {
        trBody.addChild(new Td().addChildren(Array.isArray(cellData) ? cellData : [cellData]));
      });
      tbody.addChild(trBody);
    });
    this.addChild(tbody);
  }
}

// ----------------------------------------------------
// Layout Wrappers
// ----------------------------------------------------

class AdminLTEWrapper extends Div {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' wrapper' }, children);
  }
}

class AdminLTENavbar extends Nav {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' main-header navbar navbar-expand navbar-white navbar-light' }, children);
  }
}

class AdminLTESidebar extends Aside {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' main-sidebar sidebar-dark-primary elevation-4' }, children);
  }
}

class AdminLTEContentWrapper extends Div {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' content-wrapper' }, children);
  }
}

class AdminLTEFooter extends Footer {
  constructor(attrs = {}, children = []) {
    super({ ...attrs, class: (attrs.class || '') + ' main-footer' }, children);
  }
}

// ----------------------------------------------------
// Dependency & Widget Management
// ----------------------------------------------------

const JQWIDGETS_LOADED = { status: false, loading: false };

function ensureJqWidgetsLoaded() {
  return new Promise((resolve) => {
    if (JQWIDGETS_LOADED.status) return resolve();
    if (JQWIDGETS_LOADED.loading) {
      const check = setInterval(() => {
        if (JQWIDGETS_LOADED.status) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    } else {
      loadJqWidgetsDeps().then(resolve);
    }
  });
}

function _loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function _loadCSS(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function loadAdminLTE5Deps() {
  if (document.querySelector('link[href*="adminlte.min.css"]')) return Promise.resolve();
  
  // Custom CSS Injection (THEME MODIFICATION)
  const customStyle = document.createElement('style');
  customStyle.innerHTML = getCustomGoldGradientCSS();
  document.head.appendChild(customStyle);

  const css = [
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-rc.5/dist/css/adminlte.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
  ];
  const js = [
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-rc.5/dist/js/adminlte.min.js'
  ];
  return Promise.all([...css.map(_loadCSS), ...js.map(_loadScript)]);
}

// Alias for compatibility
const loadAdminLTEDeps = loadAdminLTE5Deps;

function loadJqWidgetsDeps(theme = 'bootstrap') {
  if (JQWIDGETS_LOADED.loading) return Promise.resolve();
  JQWIDGETS_LOADED.loading = true;
  const version = '17.0.0';
  const url = `https://www.jqwidgets.com/public/jqwidgets/${version}/`;
  const css = [
    `${url}jqwidgets/styles/jqx.base.css`,
    `${url}jqwidgets/styles/jqx.${theme}.css`
  ];
  const js = [
    `${url}jqwidgets/jqx-all.js`,
  ];
  return Promise.all([...css.map(_loadCSS), ...js.map(_loadScript)])
    .then(() => {
      JQWIDGETS_LOADED.status = true;
      JQWIDGETS_LOADED.loading = false;
    })
    .catch(err => {
      console.error('Failed to load jqWidgets dependencies:', err);
      JQWIDGETS_LOADED.loading = false;
    });
}

function initAdminLTEWidgets() {
  // Initialize AdminLTE components if any custom ones are used
  if (window.AdminLTE) {
    // AdminLTE 4 auto-initializes most things but this is a safeguard
  }
}

// ----------------------------------------------------
// Flow.js-lite Integration
// ----------------------------------------------------

class HtmlFlowUploader extends Div {
  constructor(flowOptions, attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ' flow-uploader-container' });
    this.flowOptions = flowOptions;
    this.id = this.attrs.id || `flow-uploader-${Math.random().toString(36).substring(7)}`;
    this.setAttr('id', this.id);
  }

  // Simplified render and initialization example
  render() {
    this.clearChildren();
    this.addChild(new Div({ id: `${this.id}-drop`, class: 'drop-area' }).addText('Drop files here or '));
    this.addChild(new Button({ id: `${this.id}-browse`, class: 'btn btn-primary' }).addText('Select Files'));
    this.addChild(new Ul({ id: `${this.id}-list`, class: 'file-list' }));

    // Post-render initialization script
    const script = `
      <script>
        (function() {
          const id = '${this.id}';
          const options = ${JSON.stringify(this.flowOptions)};
          if (!window.Flow) {
            console.error('Flow.js-lite not loaded. Cannot initialize uploader.');
            return;
          }
          const flow = new Flow({
            target: options.target,
            chunkSize: 1024*1024,
            testChunks: false,
            query: options.query || {},
            ...options
          });

          flow.assignBrowse(document.getElementById(id + '-browse'));
          flow.assignDrop(document.getElementById(id + '-drop'));
          
          flow.on('fileAdded', (file, event) => {
            const list = document.getElementById(id + '-list');
            const listItem = document.createElement('li');
            listItem.id = 'file-' + file.uniqueIdentifier;
            listItem.innerHTML = file.name + ' (' + file.size + ') <span id="progress-' + file.uniqueIdentifier + '">0%</span>';
            list.appendChild(listItem);
            flow.upload();
          });

          flow.on('fileProgress', (file) => {
            const progressSpan = document.getElementById('progress-' + file.uniqueIdentifier);
            if (progressSpan) {
              progressSpan.innerHTML = Math.floor(file.progress() * 100) + '%';
            }
          });

          flow.on('fileSuccess', (file, message) => {
            const listItem = document.getElementById('file-' + file.uniqueIdentifier);
            if (listItem) listItem.innerHTML += ' - Uploaded!';
          });
          
          flow.on('fileError', (file, message) => {
            const listItem = document.getElementById('file-' + file.uniqueIdentifier);
            if (listItem) listItem.innerHTML += ' - Error: ' + message;
          });
        })();
      </script>
    `;

    return super.render() + script;
  }
}

// ----------------------------------------------------
// jqWidgets Component Base
// ----------------------------------------------------

class JqxWidget extends Div {
  constructor(tag, options = {}, attrs = {}) {
    super({ ...attrs, class: (attrs.class || '') + ' jqx-widget-container' });
    this.options = options;
    this.tag = tag;
    this.id = this.attrs.id || `jqx-widget-${Math.random().toString(36).substring(7)}`;
    this.setAttr('id', this.id);
  }

  render() {
    const script = `
      <script>
        (function() {
          const id = '${this.id}';
          const options = ${JSON.stringify(this.options)};
          ensureJqWidgetsLoaded().then(() => {
            if (window.jQuery && jQuery.fn.${this.tag}) {
              jQuery('#' + id)['${this.tag}'](options);
            } else {
              console.error('jqWidgets or jQuery not loaded for: ${this.tag}');
            }
          }).catch(err => console.error(err));
        })();
      </script>
    `;
    return super.render() + script;
  }
}

class JqxGrid extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxGrid', options, attrs); }
}
class JqxChart extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxChart', options, attrs); }
}
class JqxDateTimeInput extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxDateTimeInput', options, attrs); }
}
class JqxTabs extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxTabs', options, attrs); }
}
class JqxTree extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxTree', options, attrs); }
}
class JqxComboBox extends JqxWidget {
  constructor(options = {}, attrs = {}) { super('jqxComboBox', options, attrs); }
}

class JqxTab extends Div { // Represents a single tab content panel
  constructor(title, content, attrs = {}) {
    super(attrs);
    this.title = title;
    this.addChildren(Array.isArray(content) ? content : [content]);
  }
}

// ----------------------------------------------------
// Tabulator Table Integration
// ----------------------------------------------------

class HtmlTabulator extends Div {
  constructor(options = {}, attrs = {}) {
    super(attrs);
    this.options = options;
    this.id = this.attrs.id || `tabulator-${Math.random().toString(36).substring(7)}`;
    this.setAttr('id', this.id);
  }

  render() {
    const script = `
      <script>
        (function() {
          const id = '${this.id}';
          const options = ${JSON.stringify(this.options)};
          
          if (!window.Tabulator) {
            console.error('Tabulator not loaded. Cannot initialize table.');
            return;
          }
          
          const table = new Tabulator('#' + id, {
            layout: "fitColumns",
            ...options
          });
          
          // Expose table instance globally for external manipulation if needed
          window[\`Tabulator_\${id}\`] = table;
        })();
      </script>
    `;
    return super.render() + script;
  }
}

// ----------------------------------------------------
// Dropzone Integration
// ----------------------------------------------------

class HtmlDropzone extends Form {
  constructor(url, options = {}, attrs = {}) {
    super({ ...attrs, action: url, class: (attrs.class || '') + ' dropzone' });
    this.options = options;
    this.id = this.attrs.id || `dropzone-${Math.random().toString(36).substring(7)}`;
    this.setAttr('id', this.id);
  }

  render() {
    // Add default dropzone message
    this.addChild(new Div({ class: 'dz-message needsclick' }).addText('Drop files here or click to upload.'));

    const optionsStr = JSON.stringify(this.options);
    const script = `
      <script>
        (function() {
          const id = '#${this.id}';
          const options = ${optionsStr};
          
          if (!window.Dropzone) {
            console.error('Dropzone not loaded. Cannot initialize uploader.');
            return;
          }

          Dropzone.autoDiscover = false; // Prevent auto-discovery if multiple instances are used
          const dz = new Dropzone(id, {
            url: jQuery(id).attr('action'),
            ...options
          });
          
          // Expose instance
          window[\`Dropzone_\${id}\`] = dz;
        })();
      </script>
    `;
    return super.render() + script;
  }
}

// ----------------------------------------------------
// Pintura & TOAST UI Image Editor Integrations
// ----------------------------------------------------

function buildPinturaHtml(imageSrc, attrs = {}) {
  const editorId = `pintura-${Math.random().toString(36).substring(7)}`;
  const html = `
    <div id="${editorId}" style="height: 500px;" ${new Div(attrs)._renderAttrs()}></div>
    <script>
    (function() {
      const boot = () => {
        if (!window.pintura?.openDefaultImageEditor) return;
        pintura.openDefaultImageEditor({
          src: '${imageSrc}',
          target: document.getElementById('${editorId}'),
        });
      };
      if (window.pintura) boot(); else { window.addEventListener('load', boot); }
    })();
    </script>
  `;
  return html;
}

function buildToastUIEditorHtml(imageSrc, attrs = {}) {
  const editorId = `toast-ui-${Math.random().toString(36).substring(7)}`;
  const html = `
    <div id="${editorId}" ${new Div(attrs)._renderAttrs()}></div>
    <script>
    (function() {
      const boot = () => {
        if (!window.tui?.ImageEditor) return;
        const imageEditor = new tui.ImageEditor(document.getElementById('${editorId}'), {
          includeUI: {
            loadImage: {
              path: '${imageSrc}',
              name: 'SampleImage'
            },
            menu: ['crop', 'flip', 'rotate', 'draw', 'text', 'icon', 'filter'],
            initMenu: 'filter',
            uiSize: {
              width: '100%',
              height: '500px'
            },
            menuBarPosition: 'bottom'
          },
          cssMaxWidth: 700,
          cssMaxHeight: 500,
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70
          }
        });
        window[\`TOAST_UI_\${editorId}\`] = imageEditor;
        
        // Ensure white background is applied to the editor's canvas/interface
        document.getElementById('${editorId}').querySelector('.tui-image-editor-container').style.backgroundColor = '#fff';
      };
      if (window.tui?.ImageEditor) boot(); else { window.addEventListener('load', boot); }
    })();
    </script>
  `;
  return html;
}

// ----------------------------------------------------
// General Helper Functions
// ----------------------------------------------------

function createElement(tag, attrs = {}, children = []) {
  const ElementClass = exportsAll[tag.charAt(0).toUpperCase() + tag.slice(1)] || HtmlElement;
  return new ElementClass(tag, attrs, children);
}

function buildListGroup(items, flush = false, numbered = false, attrs = {}) {
  const ListTag = numbered ? Ol : Ul;
  const list = new ListTag({ ...attrs, class: (attrs.class || '') + ` list-group${flush ? ' list-group-flush' : ''}` });
  items.forEach(item => {
    const li = new Li({ class: 'list-group-item' });
    li.addChildren(Array.isArray(item) ? item : [item]);
    list.addChild(li);
  });
  return list;
}

function buildTable(headers, data = [], bordered = true, hover = true, attrs = {}) {
  const classes = ['table'];
  if (bordered) classes.push('table-bordered');
  if (hover) classes.push('table-hover');
  
  const table = new Table({ ...attrs, class: (attrs.class || '') + ' ' + classes.join(' ') });

  // Thead
  const thead = new Thead();
  const trHead = new Tr();
  headers.forEach(h => trHead.addChild(new Th().addText(h)));
  thead.addChild(trHead);
  table.addChild(thead);

  // Tbody
  const tbody = new Tbody();
  data.forEach(rowData => {
    const trBody = new Tr();
    rowData.forEach(cellData => {
      trBody.addChild(new Td().addChildren(Array.isArray(cellData) ? cellData : [cellData]));
    });
    tbody.addChild(trBody);
  });
  table.addChild(tbody);

  return table;
}

function buildAlert(content, color = 'info', dismissible = false, attrs = {}) {
  const alert = new Div({
    ...attrs,
    role: 'alert',
    class: (attrs.class || '') + ` alert alert-${color}` + (dismissible ? ' alert-dismissible fade show' : '')
  });
  
  alert.addChildren(Array.isArray(content) ? content : [content]);

  if (dismissible) {
    alert.addChild(new Button({
      type: 'button',
      class: 'btn-close',
      'data-bs-dismiss': 'alert',
      'aria-label': 'Close'
    }));
  }
  return alert;
}

function buildForm(fields, submitText = 'Submit', attrs = {}) {
  const form = new Form(attrs);
  
  fields.forEach(field => {
    const formGroup = new Div({ class: 'mb-3' });
    
    // Label
    if (field.label) {
      formGroup.addChild(new Label({ for: field.id }).addText(field.label));
    }
    
    // Input/Textarea
    let input;
    const inputAttrs = { 
      id: field.id, 
      name: field.name || field.id, 
      class: 'form-control', 
      ...field.attrs 
    };

    if (field.type === 'textarea') {
      input = new Textarea(inputAttrs).addText(field.value || '');
    } else if (field.type === 'select') {
      input = new HtmlElement('select', inputAttrs);
      (field.options || []).forEach(opt => {
        const option = new HtmlElement('option', { value: opt.value }).addText(opt.text);
        if (opt.value == field.value) option.setAttr('selected', true);
        input.addChild(option);
      });
      input.setAttr('class', 'form-select');
    } else {
      input = new Input({ type: field.type || 'text', value: field.value || '', ...inputAttrs });
    }
    
    formGroup.addChild(input);
    
    // Help Text
    if (field.helpText) {
      formGroup.addChild(new Div({ class: 'form-text' }).addText(field.helpText));
    }
    
    form.addChild(formGroup);
  });

  // Submit Button (THEME MODIFICATION: Add Gold Gradient Class)
  form.addChild(new Button({ 
    type: 'submit', 
    class: 'btn btn-primary bg-gold-gradient' // Applies gold gradient
  }).addText(submitText));

  return form;
}

function buildModal(id, title, bodyContent, footerContent = null, size = null, attrs = {}) {
  const modal = new Div({
    ...attrs,
    class: (attrs.class || '') + ' modal fade',
    id: id,
    tabindex: '-1',
    'aria-labelledby': `${id}Label`,
    'aria-hidden': 'true'
  });

  const dialogClasses = `modal-dialog${size ? ` modal-${size}` : ''}`;
  const dialog = new Div({ class: dialogClasses });
  modal.addChild(dialog);

  const content = new Div({ class: 'modal-content' });
  dialog.addChild(content);

  // Header
  const header = new Div({ class: 'modal-header' });
  header.addChild(new H5({ class: 'modal-title', id: `${id}Label` }).addText(title));
  header.addChild(new Button({
    type: 'button',
    class: 'btn-close',
    'data-bs-dismiss': 'modal',
    'aria-label': 'Close'
  }));
  content.addChild(header);

  // Body
  const body = new Div({ class: 'modal-body' });
  body.addChildren(Array.isArray(bodyContent) ? bodyContent : [bodyContent]);
  content.addChild(body);

  // Footer
  const footer = new Div({ class: 'modal-footer' });
  if (footerContent) {
    footer.addChildren(Array.isArray(footerContent) ? footerContent : [footerContent]);
  } else {
    // Default close button (THEME MODIFICATION: Add Gold Gradient Class)
    footer.addChild(new Button({
      type: 'button',
      class: 'btn btn-primary bg-gold-gradient', // Applies gold gradient
      'data-bs-dismiss': 'modal'
    }).addText('Close'));
  }
  content.addChild(footer);

  return modal;
}

function buildAdminMenu(items, isSidebar = true) {
  // A complex function implementation is assumed here, returning a Nav element
  // that uses <a> tags. No direct styling changes needed here, relies on AdminLTE CSS.
  // The structure typically involves <ul> and <li> with class 'nav-item' and 'nav-link'.
  // The active link relies on the external CSS in getCustomGoldGradientCSS for gradient.
  const ul = new Ul({ class: `nav nav-pills nav-sidebar flex-column` });
  
  const buildItem = (item) => {
    const li = new Li({ class: 'nav-item' });
    const link = new A({ href: item.link || '#', class: 'nav-link' + (item.active ? ' active' : '') });
    link.addChild(new I({ class: `nav-icon ${item.icon || 'fas fa-th'}` }));
    link.addChild(new P().addText(item.text));
    li.addChild(link);
    return li;
  }
  
  items.forEach(item => ul.addChild(buildItem(item)));
  
  const sidebarMenu = new Div({ class: 'sidebar' }).addChild(new Nav({ class: 'mt-2' }).addChild(ul));
  return isSidebar ? sidebarMenu : ul;
}

function buildAdminBreadcrumb(items) {
  const ol = new Ol({ class: 'breadcrumb float-sm-right' });
  items.forEach((item, index) => {
    const li = new Li({ class: 'breadcrumb-item' + (item.active ? ' active' : '') });
    if (item.active) {
      li.addText(item.text);
    } else {
      li.addChild(new A({ href: item.link || '#' }).addText(item.text));
    }
    ol.addChild(li);
  });

  const header = new Div({ class: 'content-header' });
  const container = new Div({ class: 'container-fluid' });
  const row = new Div({ class: 'row mb-2' });
  row.addChild(new Div({ class: 'col-sm-6' }).addChild(new H1({ class: 'm-0' }).addText(items.slice(-1)[0].text)));
  row.addChild(new Div({ class: 'col-sm-6' }).addChild(ol));
  container.addChild(row);
  header.addChild(container);
  return header;
}

// ----------------------------------------------------
// Exports to window
// ----------------------------------------------------
const exportsAll = {
  // Base + types
  HtmlElement, HtmlText, HtmlRaw,
  Label, Strong, I, B, H1, H2, H3, H4, H5, H6,
  Div, Span, Form, Input, Textarea, Button, P, Img, A, Ul, Li, Ol,
  Table, Thead, Tbody, Tr, Th, Td, Nav, Aside, Main, Footer,
  // Bootstrap/AdminLTE
  Card, Badge, Spinner, Accordion, AccordionItem, AccordionHeader, AccordionBody,
  loadAdminLTE5Deps, loadAdminLTEDeps,
  AdminLTEWrapper, AdminLTENavbar, AdminLTESidebar, AdminLTEContentWrapper, AdminLTEFooter,
  AdminLTECard, AdminLTEGoldCard, AdminLTEInfoBox, AdminLTESmallBox, AdminLTECallout, AdminLTETable, // ADDED: AdminLTEGoldCard
  buildAdminBreadcrumb, buildAdminMenu, initAdminLTEWidgets,
  // helpers
  buildListGroup, buildTable, buildAlert, buildForm, buildModal, createElement,
  // Flow
  HtmlFlowUploader,
  // jqWidgets
  loadJqWidgetsDeps, ensureJqWidgetsLoaded, JqxWidget, JqxGrid, JqxChart, JqxDateTimeInput, JqxTabs, JqxTab, JqxTree, JqxComboBox,
  // Tabulator, Dropzone, Pintura, TOAST UI
  HtmlTabulator, HtmlDropzone, buildPinturaHtml, buildToastUIEditorHtml
};

// Global export (assumed context for the original file)
Object.assign(window, exportsAll);

// Expose exportsAll for internal use
window.HtmlJsExports = exportsAll;
