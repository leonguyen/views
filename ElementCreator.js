class ElementCreator {
    constructor(tagName, parentElement) {
        this.tagName = tagName;
        this.parentElement = parentElement;
        this.element = this.createElement();
    }

    createElement() {
        const newElement = document.createElement(this.tagName);
        this.parentElement.appendChild(newElement);
        return newElement;
    }

    addEvent(eventType, callback) {
        this.element.addEventListener(eventType, callback);
    }

    setText(text) {
        this.element.textContent = text;
    }

    setStyle(styleObject) {
        Object.assign(this.element.style, styleObject);
    }
}

// Usage example
const app = document.getElementById('app'); // Assuming there's a div with id 'app'

// Create a button
const button = new ElementCreator('button', app);
button.setText('Click Me');
button.setStyle({ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' });

// Add click event listener
button.addEvent('click', () => {
    alert('Button was clicked!');
});

// Create a paragraph
const paragraph = new ElementCreator('p', app);
paragraph.setText('This is a dynamically created paragraph.');
paragraph.setStyle({ color: 'black', fontSize: '16px' });
