// HtmlAdmin.js
// Integrates AdminLTE (v3.2) components into Html.js builder classes
// Assumes Html.js is loaded and provides HtmlElement, Div, Card, Span, H3, Button, Img, A, Ul, Li, Table, Thead, Tbody, Tr, Th, Td, createElement, etc.

(function(global){
  if (typeof global === 'undefined') global = window;
  if (!global.HtmlElement) {
    console.error('Html.js must be loaded before HtmlAdmin.js');
    return;
  }

  // --- Dependency loader ---
  function loadAdminLTEDeps(opts = {}){
    // opts.cdnVersion may be provided; default to 3.2
    const adminlteVersion = opts.adminlteVersion || '3.2.0';
    const deps = [
      // Bootstrap 4 CSS (AdminLTE 3.x uses Bootstrap 4)
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
      // Font Awesome
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      // AdminLTE CSS
      `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/css/adminlte.min.css`,
    ];

    const scripts = [
      'https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js',
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
      `https://cdn.jsdelivr.net/npm/admin-lte@${adminlteVersion}/dist/js/adminlte.min.js`,
    ];

    deps.forEach(url => {
      if (!document.querySelector(`link[href='${url}']`)){
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    scripts.forEach(url => {
      if (!document.querySelector(`script[src='${url}']`)){
        const s = document.createElement('script');
        s.src = url;
        s.defer = false;
        document.head.appendChild(s);
      }
    });

    return { css: deps, js: scripts };
  }

  // --- Semantic element classes missing from Html.js ---
  class Nav extends global.HtmlElement { constructor(attrs = {}, children = []){ super('nav', attrs, children);} }
  class Aside extends global.HtmlElement { constructor(attrs = {}, children = []){ super('aside', attrs, children);} }
  class Main extends global.HtmlElement { constructor(attrs = {}, children = []){ super('main', attrs, children);} }
  class Footer extends global.HtmlElement { constructor(attrs = {}, children = []){ super('footer', attrs, children);} }

  // Export semantic classes
  global.Nav = Nav; global.Aside = Aside; global.Main = Main; global.Footer = Footer;

  // --- Layout Components ---
  class AdminLTEWrapper extends global.Div {
    constructor(attrs = {}, children = []){
      super({ class: 'wrapper', ...attrs }, children);
    }
  }

  class AdminLTENavbar extends Nav {
    constructor(attrs = {}, children = []){
      super({ class: 'main-header navbar navbar-expand navbar-white navbar-light', role: 'navigation', ...attrs }, children);
    }

    addLeftToggleButton(){
      const btn = new A({ href: '#', class: 'nav-link', 'data-widget': 'pushmenu', role: 'button' }).addRawHtml('<i class="fas fa-bars"></i>');
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

    addSearch(formHtml){
      const form = new Div({ class: 'form-inline' }).addRawHtml(formHtml || '');
      this._sidebarContent.addChild(form);
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

  // --- AdminLTE Widgets ---
  class AdminLTECard extends global.Card {
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

  class AdminLTEInfoBox extends global.Div {
    constructor(iconClass, text, number, bg='info', attrs = {}){
      super({ class: 'info-box', ...attrs });
      this.addChild(new Span({ class: `info-box-icon bg-${bg}` }).addRawHtml(`<i class="${iconClass}"></i>`));
      const content = new Div({ class: 'info-box-content' })
        .addChild(new Span({ class: 'info-box-text' }).addText(text))
        .addChild(new Span({ class: 'info-box-number' }).addText(number));
      this.addChild(content);
    }
  }

  class AdminLTESmallBox extends global.Div {
    constructor(number, text, iconClass='fa fa-chart-pie', bg='info', linkHref = '#', attrs = {}){
      super({ class: `small-box bg-${bg}`, ...attrs });
      const inner = new Div({ class: 'inner' }).addChild(new H3().addText(String(number))).addChild(new P().addText(text));
      const icon = new Div({ class: 'icon' }).addRawHtml(`<i class="${iconClass}"></i>`);
      const link = new A({ href: linkHref, class: 'small-box-footer' }).addRawHtml('More info <i class="fas fa-arrow-circle-right"></i>');
      this.addChild(inner).addChild(icon).addChild(link);
    }
  }

  class AdminLTECallout extends global.Div {
    constructor(title, message, type='info', attrs = {}){
      super({ class: `callout callout-${type}`, ...attrs });
      if (title) this.addChild(new H5().addText(title));
      if (message) this.addChild(new P().addText(message));
    }
  }

  class AdminLTETable extends global.Table {
    constructor(attrs = {}, headers = [], rows = []){
      super({ class: 'table table-bordered table-hover', ...attrs });
      if (headers.length) this.addChild(new Thead().addChild(new Tr().addChildren(headers.map(h => new Th().addText(h)))));
      const tb = new Tbody();
      rows.forEach(row => tb.addChild(new Tr().addChildren(row.map(c => new Td().addText(c)))));
      this.addChild(tb);
    }
  }

  // --- Helper builders ---
  class Ol extends global.HtmlElement { constructor(attrs = {}, children = []){ super('ol', attrs, children);} }
  global.Ol = Ol;

  function buildAdminBreadcrumb(items = []){
    const ol = new Ol({ class: 'breadcrumb float-sm-right' });
    items.forEach(it => ol.addChild(new Li({ class: 'breadcrumb-item' }).addChild(it.href ? new A({ href: it.href }).addText(it.text) : new Span().addText(it.text))));
    return new Div({ class: 'container-fluid' }).addChild(new Div({ class: 'row mb-2' })
      .addChild(new Div({ class: 'col-sm-6' }))
      .addChild(new Div({ class: 'col-sm-6' }).addChild(ol)));
  }

  function buildAdminMenu(items = []){
    const nav = new Nav({ class: 'mt-2' });
    const ul = new Ul({ class: 'nav nav-pills nav-sidebar flex-column', 'data-widget': 'treeview', role: 'menu', 'data-accordion': 'false' });

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

  function initAdminLTEWidgets(){
    try{
      if (typeof window.$ == 'function' && typeof window.$.AdminLTE !== 'undefined'){
      }
    } catch(e){ console.warn('initAdminLTEWidgets:', e); }
  }

  global.loadAdminLTEDeps = loadAdminLTEDeps;
  global.AdminLTEWrapper = AdminLTEWrapper;
  global.AdminLTENavbar = AdminLTENavbar;
  global.AdminLTESidebar = AdminLTESidebar;
  global.AdminLTEContentWrapper = AdminLTEContentWrapper;
  global.AdminLTEFooter = AdminLTEFooter;
  global.AdminLTECard = AdminLTECard;
  global.AdminLTEInfoBox = AdminLTEInfoBox;
  global.AdminLTESmallBox = AdminLTESmallBox;
  global.AdminLTECallout = AdminLTECallout;
  global.AdminLTETable = AdminLTETable;
  global.buildAdminMenu = buildAdminMenu;
  global.buildAdminBreadcrumb = buildAdminBreadcrumb;
  global.initAdminLTEWidgets = initAdminLTEWidgets;

})(window);

// End of HtmlAdmin.js
