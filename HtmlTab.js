import {
  Div,
  Ul,
  Li,
  A,
  HtmlRaw
} from './Html.js';

// Bootstrap 5 Tabs Nav
const tabsNav = new Ul({ class: 'nav nav-tabs', id: 'myTab', role: 'tablist' })
  .addChild(
    new Li({ class: 'nav-item', role: 'presentation' })
      .addChild(
        new A({
          class: 'nav-link active',
          id: 'home-tab',
          'data-bs-toggle': 'tab',
          href: '#home',
          role: 'tab',
          'aria-controls': 'home',
          'aria-selected': 'true'
        }).addText('Home')
      )
  )
  .addChild(
    new Li({ class: 'nav-item', role: 'presentation' })
      .addChild(
        new A({
          class: 'nav-link',
          id: 'profile-tab',
          'data-bs-toggle': 'tab',
          href: '#profile',
          role: 'tab',
          'aria-controls': 'profile',
          'aria-selected': 'false'
        }).addText('Profile')
      )
  )
  .addChild(
    new Li({ class: 'nav-item', role: 'presentation' })
      .addChild(
        new A({
          class: 'nav-link',
          id: 'contact-tab',
          'data-bs-toggle': 'tab',
          href: '#contact',
          role: 'tab',
          'aria-controls': 'contact',
          'aria-selected': 'false'
        }).addText('Contact')
      )
  )
  .addChild(
    new Li({ class: 'nav-item', role: 'presentation' })
      .addChild(
        new A({
          class: 'nav-link',
          id: 'settings-tab',
          'data-bs-toggle': 'tab',
          href: '#settings',
          role: 'tab',
          'aria-controls': 'settings',
          'aria-selected': 'false'
        }).addText('Settings')
      )
  );

// Bootstrap 5 Tab Content
const tabContent = new Div({ class: 'tab-content', id: 'myTabContent' })
  .addChild(
    new Div({
      class: 'tab-pane fade show active',
      id: 'home',
      role: 'tabpanel',
      'aria-labelledby': 'home-tab'
    }).addText('Home tab content.')
  )
  .addChild(
    new Div({
      class: 'tab-pane fade',
      id: 'profile',
      role: 'tabpanel',
      'aria-labelledby': 'profile-tab'
    }).addText('Profile tab content.')
  )
  .addChild(
    new Div({
      class: 'tab-pane fade',
      id: 'contact',
      role: 'tabpanel',
      'aria-labelledby': 'contact-tab'
    }).addText('Contact tab content.')
  )
  .addChild(
    new Div({
      class: 'tab-pane fade',
      id: 'settings',
      role: 'tabpanel',
      'aria-labelledby': 'settings-tab'
    }).addText('Settings tab content.')
  );

// Bootstrap JS Initialization Script (Optional)
const bootstrapInitScript = new HtmlRaw(`
<script>
  var triggerTabList = [].slice.call(document.querySelectorAll('#myTab a'))
  triggerTabList.forEach(function (triggerEl) {
    var tabTrigger = new bootstrap.Tab(triggerEl)
  })
</script>
`);

// Final export
const tabsModule = new Div()
  .addChild(tabsNav)
  .addChild(tabContent)
  .addChild(bootstrapInitScript)
  .toHtml();

export default tabsModule;
