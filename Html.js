class Html {
  constructor(name = null, attrs = {}) {
    this.name = name;
    this.attrs = { ...attrs };
    this.children = [];
  }
  
  setName(name) {
    this.name = name;
    return this;
  }
  
  getName() {
    return this.name;
  }
  
  setAttribute(key, value) {
    if (value === null || value === undefined) {
      delete this.attrs[key];
    } else {
      this.attrs[key] = value;
    }
    return this;
  }
  
  getAttribute(key) {
    return this.attrs[key];
  }
  
  addAttributes(attrs) {
    for (const key in attrs) {
      this.setAttribute(key, attrs[key]);
    }
    return this;
  }
  
  removeAttribute(key) {
    delete this.attrs[key];
    return this;
  }
  
  addHtml(html) {
    this.children.push({ type: 'html', value: html });
    return this;
  }
  
  addText(text) {
    this.children.push({ type: 'text', value: text });
    return this;
  }
  
  addChild(child) {
    this.children.push(child);
    return this;
  }
  
  removeChildren() {
    this.children = [];
    return this;
  }
  
  setHtml(html) {
    this.children = [{ type: 'html', value: html }];
    return this;
  }
  
  setText(text) {
    this.children = [{ type: 'text', value: text }];
    return this;
  }
  
  // Gestion des classes CSS en tableau ou objet
  classAdd(name) {
    this.attrs.class = (this.attrs.class || '').split(' ').filter(Boolean);
    if (!this.attrs.class.includes(name)) {
      this.attrs.class.push(name);
    }
    this.attrs.class = this.attrs.class.join(' ');
    return this;
  }
  
  // Gestion de style en objet
  setStyle(property, value) {
    this.attrs.style = this.attrs.style || '';
    const styles = this.attrs.style
      .split(';')
      .filter(Boolean)
      .reduce((acc, style) => {
        const [key, val] = style.split(':').map(s => s.trim());
        if (key) acc[key] = val;
        return acc;
      }, {});
    styles[property] = value;
    this.attrs.style = Object.entries(styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    return this;
  }
  
  // Rendu de l’objet en HTML sécurisé
  toHtml() {
    if (this.name === null) {
      // Fragment sans balise englobante
      return this.children.map(child => this.renderChild(child)).join('');
    }
    const attrs = Object.entries(this.attrs)
      .map(([k, v]) => v === true ? k : v === false || v == null ? '' : `${k}="${HtmlElement.escapeAttr(v)}"`)
      .filter(Boolean)
      .join(' ');
    const opening = `<${this.name}${attrs ? ' ' + attrs : ''}>`;
    
    // Balises vides (img, input, etc.)
    const emptyElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];
    if (emptyElements.includes(this.name)) {
      return opening;
    }
    const childrenHtml = this.children.map(child => this.renderChild(child)).join('');
    return `${opening}${childrenHtml}</${this.name}>`;
  }
  
  renderChild(child) {
    if (typeof child === 'string') return HtmlElement.escapeHtml(child);
    if (child.type === 'html') return child.value;
    if (child.type === 'text') return HtmlElement.escapeHtml(child.value);
    if (child instanceof HtmlElement) return child.toHtml();
    return '';
  }
  
  // Helpers d’échappement
  static escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  static escapeAttr(str) {
    return HtmlElement.escapeHtml(str).replace(/"/g, '&quot;');
  }
  
  // Alias pour conversion en chaîne
  toString() {
    return this.toHtml();
  }
}

class Div extends HtmlElement {
    constructor(attributes = {}, children = []) {
        super('div', attributes, children);
    }
}

class Span extends HtmlElement {
    constructor(attributes = {}, children = []) {
        super('span', attributes, children);
    }
}

class Input extends HtmlElement {
    constructor(type, attributes = {}) {
        super('input', { type, ...attributes });
    }

    render() {
        const attrs = Object.entries(this.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        return `<input ${attrs} />`;
    }
}

class Button extends HtmlElement {
    constructor(attributes = {}, children = []) {
        super('button', attributes, children);
    }
}
/*
// Création d’un élément <img src="image.jpg">
const img = new HtmlElement('img').setAttribute('src', 'image.jpg');
console.log(img.toHtml()); // <img src="image.jpg">

// Création avec classes
const input = new HtmlElement('input', { type: 'text', class: 'important' });

// Changement de nom
input.setName('textarea');

// Définir plusieurs attributs
input.addAttributes({ disabled: true, placeholder: 'Tapez un texte...' });

// Gestion des enfants (contenu textuel ou html)
const div = new HtmlElement('div').addText('hello').addHtml('<br>');
console.log(div.toHtml()); // <div>hello<br></div>

// Fragment (pas de balise englobante)
const fragment = new HtmlElement(null).addText('A').addHtml('<hr>');
console.log(fragment.toHtml()); // A<hr>

*/