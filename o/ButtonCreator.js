class ButtonCreator {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.counter = 0;
  }

  // Event handler method
  handleButtonClick(event) {
    console.log('Button clicked:', event.target);
    this.addButton(); // On clicking, add a new button
  }

  // Method to create a button
  addButton() {
    this.counter++;

    const newBtn = document.createElement('button');
    newBtn.textContent = `Button ${this.counter}`;
    newBtn.className = 'dynamic-button';

    // Bind event listener with the handler method, preserving context
    newBtn.addEventListener('click', this.handleButtonClick.bind(this));

    this.container.appendChild(newBtn);
  }

  // Initialize with the first button and its listener
  init() {
    this.addButton();
  }
}

// Usage
//const buttonApp = new ButtonCreator('#button-container');
//buttonApp.init();