// --- Load AdminLTE v4 CSS/JS dependencies (Bootstrap 5, FontAwesome, AdminLTE) ---
loadAdminLTE5Deps({ adminlteVersion: '4.0.0' });

// --- Helper: Build sidebar menu dynamically from JSON ---
function buildSidebarMenu(items) {
  function makeItem(it) {
    const li = new Li({ class: 'nav-item' + (it.children?.length ? ' has-treeview' : '') });
    const a = new A({ href: it.href || '#', class: 'nav-link' + (it.active ? ' active' : '') });

    if (it.icon) a.addChild(new Span({ class: `nav-icon ${it.icon}` }));
    a.addChild(new P().addText(it.text));

    if (it.children?.length) {
      a.addRawHtml('<i class="right fas fa-angle-left"></i>');
    }
    li.addChild(a);

    if (it.children?.length) {
      const ul = new Ul({ class: 'nav nav-treeview' });
      it.children.forEach(c => ul.addChild(makeItem(c)));
      li.addChild(ul);
    }
    return li;
  }
  const nav = new Nav({ class: 'mt-2' });
  const ul = new Ul({
    class: 'nav nav-pills nav-sidebar flex-column',
    'data-widget': 'treeview',
    role: 'menu',
    'data-accordion': 'false'
  });
  items.forEach(i => ul.addChild(makeItem(i)));
  nav.addChild(ul);
  return nav;
}

// --- Widget Builders ---
function createInfoBox(bgClass, iconClass, text, number, progressPercent, description) {
  return new HtmlRaw(`
    <div class="info-box ${bgClass}">
      <span class="info-box-icon"><i class="${iconClass}"></i></span>
      <div class="info-box-content">
        <span class="info-box-text">${text}</span>
        <span class="info-box-number">${number}</span>
        <div class="progress">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        <span class="progress-description">${description}</span>
      </div>
    </div>
  `);
}

function createSmallBox(bgClass, number, text, iconClass, link, linkText) {
  return new HtmlRaw(`
    <div class="small-box ${bgClass}">
      <div class="inner"><h3>${number}</h3><p>${text}</p></div>
      <div class="icon"><i class="${iconClass}"></i></div>
      <a href="${link}" class="small-box-footer">${linkText} <i class="fas fa-arrow-circle-right"></i></a>
    </div>
  `);
}

function createCallout(type, title, content) {
  return new HtmlRaw(`
    <div class="callout callout-${type}">
      <h5>${title}</h5>
      <p>${content}</p>
    </div>
  `);
}

// --- Form validation enabling function ---
function enableFormValidation() {
  window.addEventListener('load', () => {
    const forms = document.getElementsByClassName('needs-validation');
    Array.prototype.forEach.call(forms, form => {
      form.addEventListener(
        'submit',
        event => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  });
}

// --- Build AdminLTE page structure ---

const wrapper = new AdminLTEWrapper();
const navbar = new AdminLTENavbar().addLeftToggleButton();
const sidebar = new AdminLTESidebar('<b>MyBrand</b> Admin');

sidebar.addUserPanel(`
  <div class="image">
    <img src="https://adminlte.io/themes/v4/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
  </div>
  <div class="info">
    <a href="#" class="d-block">Alexander Pierce</a>
  </div>
`);

const sidebarMenuItems = [
  { text: 'Dashboard', href: '#', active: true, icon: 'fas fa-tachometer-alt' },
  {
    text: 'Layout Options',
    icon: 'fas fa-copy',
    children: [
      { text: 'Top Navigation', href: '#' },
      { text: 'Boxed', href: '#' },
      { text: 'Fixed Sidebar', href: '#' },
    ],
  },
  { text: 'Charts', href: '#', icon: 'fas fa-chart-pie' },
];

sidebar.addMenu(buildSidebarMenu(sidebarMenuItems));

const contentWrapper = new AdminLTEContentWrapper().addContentHeader('Dashboard');

const mainContentDiv = new Div({ class: 'container-fluid' });

// UI Elements Card
const uiElementsCard = new AdminLTECard('info')
  .addHeader('UI Elements')
  .addBody(
    new Div({ class: 'd-flex flex-wrap gap-2 mb-3' })
      .addChild(new Button({ class: 'btn btn-primary' }).addText('Primary Button'))
      .addChild(new Button({ class: 'btn btn-outline-secondary' }).addText('Outline Button'))
      .addChild(new Span({ class: 'badge bg-success' }).addText('Success Badge'))
      .addChild(
        new Div({ class: 'spinner-border text-primary', role: 'status' }).addChild(
          new Span({ class: 'visually-hidden' }).addText('Loading...')
        )
      )
  )
  .addBody(
    new HtmlRaw(`
    <div class="accordion" id="dashboardAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading1">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
            Accordion Item #1
          </button>
        </h2>
        <div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#dashboardAccordion">
          <div class="accordion-body">Content for the first accordion item.</div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading2">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
            Accordion Item #2
          </button>
        </h2>
        <div id="collapse2" class="accordion-collapse collapse" data-bs-parent="#dashboardAccordion">
          <div class="accordion-body">Content for the second accordion item.</div>
        </div>
      </div>
    </div>
  `)
  );

mainContentDiv.addChild(uiElementsCard);

// Forms Card
const formCard = new AdminLTECard('warning')
  .addHeader('Sample Form')
  .addBody(
    new Form({ novalidate: true, class: 'needs-validation' })
      .addChild(
        new Div({ class: 'mb-3' })
          .addChild(new Label({ for: 'inputEmail', class: 'form-label' }).addText('Email address'))
          .addChild(new Input('email', { class: 'form-control', id: 'inputEmail', placeholder: 'name@example.com', required: true }))
          .addChild(new Div({ class: 'invalid-feedback' }).addText('Please enter a valid email.'))
      )
      .addChild(
        new Div({ class: 'mb-3' })
          .addChild(new Label({ for: 'inputPassword', class: 'form-label' }).addText('Password'))
          .addChild(new Input('password', { class: 'form-control', id: 'inputPassword', placeholder: 'Password', required: true }))
          .addChild(new Div({ class: 'invalid-feedback' }).addText('Please enter your password.'))
      )
      .addChild(
        new Div({ class: 'mb-3 form-check' })
          .addChild(new Input('checkbox', { class: 'form-check-input', id: 'checkMeOut' }))
          .addChild(new Label({ class: 'form-check-label', for: 'checkMeOut' }).addText('Check me out'))
      )
      .addChild(new Button({ type: 'submit', class: 'btn btn-warning' }).addText('Submit'))
  );

mainContentDiv.addChild(formCard);

// Tables Card
const tableCard = new AdminLTECard('success')
  .addHeader('Sample Table')
  .addBody(
    new Table({ class: 'table table-striped table-bordered' })
      .addChild(
        new Thead().addChild(
          new Tr()
            .addChild(new Th().addText('#'))
            .addChild(new Th().addText('Name'))
            .addChild(new Th().addText('Email'))
            .addChild(new Th().addText('Role'))
        )
      )
      .addChild(
        new Tbody()
          .addChild(new Tr().addChild(new Td().addText('1')).addChild(new Td().addText('John Doe')).addChild(new Td().addText('john@example.com')).addChild(new Td().addText('Admin')))
          .addChild(new Tr().addChild(new Td().addText('2')).addChild(new Td().addText('Jane Smith')).addChild(new Td().addText('jane@example.com')).addChild(new Td().addText('User')))
      )
  );

mainContentDiv.addChild(tableCard);

// Widgets Card
const widgetCard = new AdminLTECard('primary')
  .addHeader('Widgets')
  .addBody(
    new Div({ class: 'row' })
      .addChild(
        new Div({ class: 'col-lg-4 col-6' }).addChild(
          createInfoBox('bg-info', 'fas fa-cogs', 'CPU Traffic', '10%', 10, 'More info below')
        )
      )
      .addChild(
        new Div({ class: 'col-lg-4 col-6' }).addChild(
          createSmallBox('bg-success', '53%', 'Bounce Rate', 'ion ion-stats-bars', '#', 'More info')
        )
      )
      .addChild(
        new Div({ class: 'col-lg-4 col-12' }).addChild(
          createCallout('warning', 'Warning!', 'This is a warning callout message.')
        )
      )
  );

mainContentDiv.addChild(widgetCard);

contentWrapper.addMainContent(mainContentDiv);

const footer = new AdminLTEFooter().addRawHtml(`
  <div class="float-right d-none d-sm-inline">Anything you want</div>
  <strong>&copy; 2024 <a href="https://yourcompany.com">Your Company</a>.</strong> All rights reserved.
`);

wrapper.addChild(navbar).addChild(sidebar).addChild(contentWrapper).addChild(footer);

document.body.appendChild(wrapper.toHtmlElement());

// Enable Bootstrap 5 validation styles
enableFormValidation();

// -- Authentication Login Card Example (optional for separate page or modal) --
/*
const loginWrapper = new Div({ class: 'hold-transition login-page d-flex justify-content-center align-items-center vh-100' });

const loginCard = new AdminLTECard('primary')
  .addHeader('Login')
  .addBody(
    new Form({ novalidate: true })
      .addChild(
        new Div({ class: 'mb-3' })
          .addChild(new Label({ for: 'email', class: 'form-label' }).addText('Email'))
          .addChild(new Input('email', { class: 'form-control', id: 'email', placeholder: 'Enter email', required: true }))
          .addChild(new Div({ class: 'invalid-feedback' }).addText('Please enter your email.'))
      )
      .addChild(
        new Div({ class: 'mb-3' })
          .addChild(new Label({ for: 'password', class: 'form-label' }).addText('Password'))
          .addChild(new Input('password', { class: 'form-control', id: 'password', placeholder: 'Password', required: true }))
          .addChild(new Div({ class: 'invalid-feedback' }).addText('Please enter your password.'))
      )
      .addChild(new Button({ type: 'submit', class: 'btn btn-primary w-100' }).addText('Sign In'))
  );

loginWrapper.addChild(loginCard);
document.body.appendChild(loginWrapper.toHtmlElement());
enableFormValidation();
*/
