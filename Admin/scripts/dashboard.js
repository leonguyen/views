// Load AdminLTE v4 dependencies (Bootstrap 5, FontAwesome, AdminLTE CSS/JS)
loadAdminLTE5Deps({ adminlteVersion: '4.0.0' });

// Create the main AdminLTE page wrapper
const wrapper = new AdminLTEWrapper();

// Create Navbar with sidebar toggle button
const navbar = new AdminLTENavbar().addLeftToggleButton();

// Create Sidebar with brand logo and user panel
const sidebar = new AdminLTESidebar('<b>MyBrand</b> Admin');

sidebar.addUserPanel(`
  <div class="image">
    <img src="https://adminlte.io/themes/v4/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
  </div>
  <div class="info">
    <a href="#" class="d-block">Alexander Pierce</a>
  </div>
`);

// Add Sidebar menu with nested treeview using raw HTML
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

// Create the main content wrapper with content header and main content
const contentWrapper = new AdminLTEContentWrapper()
  .addContentHeader('Dashboard')
  .addMainContent(
    new Div()
      .addChild(
        new AdminLTECard('primary')
          .addHeader('Welcome to the Dashboard')
          .addBody(`
            <p>This is a fully functional AdminLTE v4 dashboard demo.</p>
            <p>You can add panels, widgets, charts, tables, and more here.</p>
          `)
      )
      .addChild(
        new Div({ class: 'row' })
          // Example Info Box - Using raw HTML
          .addChild(new HtmlRaw(`
            <div class="col-lg-3 col-6">
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
          // Example Small Box
          .addChild(new HtmlRaw(`
            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>53<sup style="font-size: 20px">%</sup></h3>
                  <p>Bounce Rate</p>
                </div>
                <div class="icon">
                  <i class="ion ion-stats-bars"></i>
                </div>
                <a href="#" class="small-box-footer">
                  More info <i class="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
          `))
      )
  );

// Add Footer
const footer = new AdminLTEFooter().addRawHtml(`
  <div class="float-right d-none d-sm-inline">
    Anything you want
  </div>
  <strong>&copy; 2024 <a href="https://yourcompany.com">Your Company</a>.</strong> All rights reserved.
`);

// Assemble everything into the wrapper
wrapper
  .addChild(navbar)
  .addChild(sidebar)
  .addChild(contentWrapper)
  .addChild(footer);

// Append the complete AdminLTE layout to the body or container element
document.body.appendChild(wrapper.toHtmlElement());
 