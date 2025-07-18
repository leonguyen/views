class HtmlElement {
    constructor(tagName, attributes = {}, children = []) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = children;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    addChild(child) {
        this.children.push(child);
    }

    render() {
        const attrs = Object.entries(this.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        const childrenHtml = this.children.map(child => {
            return typeof child === 'string' ? child : child.render();
        }).join('');

        return `<${this.tagName} ${attrs}>${childrenHtml}</${this.tagName}>`;
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
// Example usage
const myDiv = new Div({ class: 'container' });
const myButton = new Button({}, ['Click Me']);
const myInput = new Input('text', { placeholder: 'Enter text here' });

myDiv.addChild(myButton);
myDiv.addChild(myInput);

console.log(myDiv.render());
*/