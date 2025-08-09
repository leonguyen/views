// --- Load AdminLTE v4 CSS/JS dependencies dynamically ---
loadAdminLTE5Deps({ adminlteVersion: '4.0.0' });

// --- Create main AdminLTE page wrapper ---
const wrapper = new AdminLTEWrapper();

// --- Navbar with sidebar toggle button ---
const navbar = new AdminLTENavbar().addLeftToggleButton();

// --- Sidebar with brand logo and user panel ---
const sidebar = new AdminLTESidebar('<b>MyBrand</b> Admin');
sidebar.addUserPanel(`
  <div class="image">
    <img src="https://adminlte.io/themes/v4/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
  </div>
  <div class="info">
    <a href="#" class="d-block">Alexander Pierce</a>
  </div>
`);

// Sidebar menu with nested treeview (raw HTML for simplicity)
const menuHtml = `
<nav class="mt-2">
  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

    <li class="nav-item">
      <a href="#" class="nav-link active">
        <i class="nav-icon fas fa-tachometer-alt"></i>
        <p>Dashboard</p>
      </a>
    </li>

    <li class="nav-item has-treeview">
      <a href="#" class="nav-link">
        <i class="nav-icon fas fa-copy"></i>
        <p>
          Layout Options
          <i class="fas fa-angle-left right"></i>
          <span class="badge badge-info right">6</span>
        </p>
      </a>
      <ul class="nav nav-treeview">
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="far fa-circle nav-icon"></i>
            <p>Top Navigation</p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="far fa-circle nav-icon"></i>
            <p>Boxed</p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            <i class="far fa-circle nav-icon"></i>
            <p>Fixed Sidebar</p>
          </a>
        </li>
      </ul>
    </li>

    <li class="nav-item">
      <a href="#" class="nav-link">
        <i class="nav-icon fas fa-chart-pie"></i>
        <p>Charts</p>
      </a>
    </li>

  </ul>
</nav>
`;
sidebar.addMenu(new HtmlRaw(menuHtml));

// --- Content wrapper ---
const contentWrapper = new AdminLTEContentWrapper()
  .addContentHeader('Dashboard')

  .addMainContent(
    new Div({ class: 'container-fluid' })

      // --- UI Elements Card ---
      .addChild(
        new AdminLTECard('info')
          .addHeader('UI Elements')
          .addBody(
            new Div({ class: 'd-flex flex-wrap gap-2 mb-3' })
              .addChild(new Button({ class: 'btn btn-primary' }).addText('Primary Button'))
              .addChild(new Button({ class: 'btn btn-outline-secondary' }).addText('Outline Button'))
              .addChild(new Span({ class: 'badge bg-success' }).addText('Success Badge'))
              .addChild(new Div({ class: 'spinner-border text-primary', role: 'status' }).addChild(new Span({ class: 'visually-hidden' }).addText('Loading...')))
          )
          .addBody(
            // Bootstrap 5 Accordion (fallback raw HTML if your Accordion class not defined)
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
          )
      )

      // --- Forms Card ---
      .addChild(
        new AdminLTECard('warning')
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
          )
      )

      // --- Tables Card ---
      .addChild(
        new AdminLTECard('success')
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
          )
      )

      // --- Widgets Card ---
      .addChild(
        new AdminLTECard('primary')
          .addHeader('Widgets')
          .addBody(
            new Div({ class: 'row' })
              // Info Box (raw HTML)
              .addChild(new HtmlRaw(`
                <div class="col-lg-4 col-6">
                  <div class="info-box bg-info">
                    <span class="info-box-icon"><i class="fas fa-cogs"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">CPU Traffic</span>
                      <span class="info-box-number">10<small>%</small></span>
                      <div class="progress">
                        <div class="progress-bar" style="width: 10%"></div>
                      </div>
                      <span class="progress-description">More info below</span>
                    </div>
                  </div>
                </div>
              `))
              // Small Box (raw HTML)
              .addChild(new HtmlRaw(`
                <div class="col-lg-4 col-6">
                  <div class="small-box bg-success">
                    <div class="inner">
                      <h3>53<sup style="font-size: 20px">%</sup></h3>
                      <p>Bounce Rate</p>
                    </div>
                    <div class="icon">
                      <i class="ion ion-stats-bars"></i>
                    </div>
                    <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                  </div>
                </div>
              `))
              // Callout box (raw HTML)
              .addChild(new HtmlRaw(`
                <div class="col-lg-4 col-12">
                  <div class="callout callout-warning">
                    <h5>Warning!</h5>
                    <p>This is a warning callout message.</p>
                  </div>
                </div>
              `))
          )
      ));
// --- Footer ---
const footer = new AdminLTEFooter().addRawHtml(`
  <div class="float-right d-none d-sm-inline">Anything you want</div>
  <strong>&copy; 2024 <a href="https://yourcompany.com">Your Company</a>.</strong> All rights reserved.
`);

// --- Assemble the layout ---
wrapper.addChild(navbar).addChild(sidebar).addChild(contentWrapper).addChild(footer);

// --- Attach to body ---
document.body.appendChild(wrapper.toHtmlElement());


// --- Optional: Authentication (Login) Card Page or Modal ---
// You can move this login card to a separate page or display as modal as needed

/*
const loginWrapper = new Div({ class: 'hold-transition login-page d-flex justify-content-center align-items-center vh-100' });

const loginCard = new AdminLTECard('primary')
  .addHeader('Login')
  .addBody(
    new Form()
      .addChild(new Div({ class: 'mb-3' })
        .addChild(new Label({ for: 'email', class: 'form-label' }).addText('Email'))
        .addChild(new Input('email', { class: 'form-control', id: 'email', placeholder: 'Enter email' })))
      .addChild(new Div({ class: 'mb-3' })
        .addChild(new Label({ for: 'password', class: 'form-label' }).addText('Password'))
        .addChild(new Input('password', { class: 'form-control', id: 'password', placeholder: 'Password' })))
      .addChild(new Button({ type: 'submit', class: 'btn btn-primary w-100' }).addText('Sign In'))
  );

loginWrapper.addChild(loginCard);

document.body.appendChild(loginWrapper.toHtmlElement());
*/
