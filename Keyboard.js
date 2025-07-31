// Keyboard.js

class Keyboard {
    constructor() {
        /**
         * @private
         * @type {Object.<string, Function>}
         * Stores the bound callbacks to manage them later (e.g., for unbinding).
         */
        this._bindings = {};
    }

    /**
     * Binds a keyboard shortcut to a callback function.
     * @param {string|Array<string>} keys - The key combination(s) to bind (e.g., 'ctrl+s', 'up up down down').
     * @param {Function} callback - The function to execute when the keys are pressed.
     * @param {string} [eventType='keydown'] - The event type (e.g., 'keypress', 'keydown', 'keyup').
     * @returns {void}
     */
    bind(keys, callback, eventType = 'keydown') {
        // Mousetrap.bind can take a string or an array of strings for keys
        // We'll store the binding for future management (e.g., unbinding)
        // For simplicity, if `keys` is an array, we'll store the first one as the key
        // You might want a more sophisticated way to track multiple keys for one callback
        const keyString = Array.isArray(keys) ? keys[0] : keys;

        if (this._bindings[keyString]) {
            console.warn(`Keyboard: Overwriting existing binding for key(s): ${keyString}`);
            // Optionally, unbind the old one first if you want strict single binding
            // Mousetrap.unbind(keyString);
        }

        Mousetrap.bind(keys, (e, combo) => {
            // Prevent default browser behavior for common shortcuts (e.g., Ctrl+S for save)
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // Internet Explorer compatibility
                e.returnValue = false;
            }
            callback(e, combo); // Pass the event and combination to the callback
        }, eventType);

        this._bindings[keyString] = callback; // Store the callback reference
        console.log(`Keyboard: Bound "${keyString}" to a callback.`);
    }

    /**
     * Unbinds a specific keyboard shortcut.
     * @param {string|Array<string>} keys - The key combination(s) to unbind.
     * @returns {void}
     */
    unbind(keys) {
        const keyString = Array.isArray(keys) ? keys[0] : keys;

        if (this._bindings[keyString]) {
            Mousetrap.unbind(keys);
            delete this._bindings[keyString];
            console.log(`Keyboard: Unbound "${keyString}".`);
        } else {
            console.warn(`Keyboard: No active binding found for key(s): ${keyString}`);
        }
    }

    /**
     * Triggers a specific keyboard shortcut programmatically.
     * @param {string} keys - The key combination to trigger.
     * @param {string} [eventType='keydown'] - The event type (e.g., 'keypress', 'keydown', 'keyup').
     * @returns {void}
     */
    trigger(keys, eventType = 'keydown') {
        Mousetrap.trigger(keys, eventType);
        console.log(`Keyboard: Triggered "${keys}" programmatically.`);
    }

    /**
     * Resets all Mousetrap bindings. Use with caution as this affects all global bindings.
     * @returns {void}
     */
    resetAllBindings() {
        Mousetrap.reset();
        this._bindings = {}; // Clear our internal tracking
        console.log('Keyboard: All Mousetrap bindings have been reset.');
    }

    /**
     * Optional: Bind globally (even inside input/textarea fields).
     * Requires Mousetrap's `global-bind` plugin.
     * Make sure you include mousetrap-global-bind.min.js in your HTML.
     *
     * @param {string|Array<string>} keys - The key combination(s) to bind globally.
     * @param {Function} callback - The function to execute.
     * @param {string} [eventType='keydown'] - The event type.
     * @returns {void}
     */
    bindGlobal(keys, callback, eventType = 'keydown') {
        if (typeof Mousetrap.bindGlobal === 'function') {
            Mousetrap.bindGlobal(keys, (e, combo) => {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                callback(e, combo);
            }, eventType);
            const keyString = Array.isArray(keys) ? keys[0] : keys;
            this._bindings[keyString] = callback; // Store global binding as well
            console.log(`Keyboard: Bound globally "${keyString}" to a callback.`);
        } else {
            console.warn('Keyboard: Mousetrap global-bind plugin not loaded. Cannot use bindGlobal.');
        }
    }

    /**
     * Optional: Pause all Mousetrap events.
     * Requires Mousetrap's `pause` plugin.
     * Make sure you include mousetrap-pause.min.js in your HTML.
     * @returns {void}
     */
    pause() {
        if (typeof Mousetrap.pause === 'function') {
            Mousetrap.pause();
            console.log('Keyboard: Mousetrap paused.');
        } else {
            console.warn('Keyboard: Mousetrap pause plugin not loaded. Cannot pause.');
        }
    }

    /**
     * Optional: Unpause all Mousetrap events.
     * Requires Mousetrap's `pause` plugin.
     * Make sure you include mousetrap-pause.min.js in your HTML.
     * @returns {void}
     */
    unpause() {
        if (typeof Mousetrap.unpause === 'function') {
            Mousetrap.unpause();
            console.log('Keyboard: Mousetrap unpaused.');
        } else {
            console.warn('Keyboard: Mousetrap pause plugin not loaded. Cannot unpause.');
        }
    }
}
