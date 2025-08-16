import { loadJson } from './Json.js';
import { createElement } from './Html.js';

export async function renderNavbar(containerId, jsonPath = './navbar.json') {
  const data = await loadJson(jsonPath);
  const container = document.getElementById(containerId);
  if (!container) return;

  const nav = createElement('nav', { class: 'navbar navbar-expand-lg navbar-light bg-light' }, [
    createElement('div', { class: 'container-fluid' }, [
      createElement('a', { class: 'navbar-brand', href: '#' }, data.brand),
      createElement('button', {
        class: 'navbar-toggler',
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#navbarNav',
        'aria-controls': 'navbarNav',
        'aria-expanded': 'false',
        'aria-label': 'Toggle navigation'
      }, [createElement('span', { class: 'navbar-toggler-icon' })]),
      createElement('div', { class: 'collapse navbar-collapse', id: 'navbarNav' }, [
        createElement('ul', { class: 'navbar-nav' }, data.menus.map(menu =>
          createElement('li', { class: 'nav-item dropdown' }, [
            createElement('a', {
              class: 'nav-link dropdown-toggle',
              href: '#',
              id: menu.title + 'Dropdown',
              role: 'button',
              'data-bs-toggle': 'dropdown',
              'aria-expanded': 'false'
            }, menu.title),
            createElement('ul', { class: 'dropdown-menu', 'aria-labelledby': menu.title + 'Dropdown' },
              menu.items.map(item =>
                createElement('li', {}, [
                  createElement('a', { class: 'dropdown-item', href: item.url, target: '_blank' }, item.name)
                ])
              )
            )
          ])
        ))
      ])
    ])
  ]);

  container.innerHTML = '';
  container.appendChild(nav);
}
