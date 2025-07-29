// Remove the import statement for voca.
// import v from 'https://cdnjs.cloudflare.com/ajax/libs/voca/1.4.0/voca.min.js';

class String {
    /**
     * Slugify a given string to make it URL-friendly.
     * @param {string} text - The input string to slugify.
     * @returns {string} - The slugified string.
     */
    slugify(text) {
        text = text.toLowerCase();
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        text = text.replace(/[^a-z0-9]+/g, '-');
        text = text.replace(/^-|-$/g, '');
        return text;
    }

    /**
     * Format a given string to be used as a filename.
     * Capitalizes each word and removes special characters.
     * @param {string} text - The input string.
     * @returns {string} - The formatted file name.
     */
    formatFileName(text) {
        const words = text.trim().split(/\s+/);
        const processedWords = words.map(word => {
            const cleanedWord = word.replace(/[^a-zA-Z0-9]/g, '');
            if (cleanedWord.length === 0) return '';
            return cleanedWord.charAt(0).toUpperCase() + cleanedWord.slice(1).toLowerCase();
        });
        return processedWords.join('');
    }

    /**
     * Get the first character of each word in a string.
     * @param {string} str - The input string.
     * @returns {string} - The concatenated first characters.
     */
    getFirstCharacters(str) {
        return str.trim().split(/\s+/) // Split by whitespace
            .map(word => word[0]) // Take first character of each word
            .join(''); // Combine into a single string
    }

    /**
     * Replaces all occurrences of a search string with a replacement string.
     * Uses voca.replaceAll for robust replacement.
     * @param {string} str - The input string.
     * @param {string} search - The string to search for.
     * @param {string} replace - The string to replace with.
     * @returns {string} - The string with replacements made.
     */
    replace(str, search, replace){
        return v.replaceAll(str, search, replace);
    }

    // --- Voca.js Extensions ---

    /**
     * Converts the first character of `str` to upper case and the remaining to lower case.
     * @param {string} str - The input string.
     * @returns {string} - The capitalized string.
     */
    capitalize(str) {
        return v.capitalize(str);
    }

    /**
     * Converts the first character of each word in `str` to upper case and the remaining to lower case.
     * @param {string} str - The input string.
     * @returns {string} - The title-cased string.
     */
    titleCase(str) {
        return v.titleCase(str);
    }

    /**
     * Converts `str` to camel case.
     * @param {string} str - The input string.
     * @returns {string} - The camel-cased string.
     */
    camelCase(str) {
        return v.camelCase(str);
    }

    /**
     * Checks if `str` ends with `suffix`.
     * @param {string} str - The input string.
     * @param {string} suffix - The suffix to check for.
     * @param {number} [position] - The position to end the search.
     * @returns {boolean} - True if `str` ends with `suffix`, false otherwise.
     */
    endsWith(str, suffix, position) {
        return v.endsWith(str, suffix, position);
    }

    /**
     * Truncates `str` if it is longer than `length`. The ellipsis `'...'` is added to the end of the truncated string.
     * @param {string} str - The input string.
     * @param {number} length - The maximum length of the string.
     * @param {string} [end] - The string to append to the end of the truncated string.
     * @returns {string} - The truncated string.
     */
    truncate(str, length, end) {
        return v.truncate(str, length, end);
    }

    /**
     * Pads `str` on the left and right sides if it is shorter than `length`.
     * @param {string} str - The input string.
     * @param {number} length - The desired length of the string.
     * @param {string} [pad] - The string to use for padding.
     * @returns {string} - The padded string.
     */
    center(str, length, pad) {
        return v.center(str, length, pad);
    }

    /**
     * Chops `str` into pieces with `length` size.
     * @param {string} str - The input string.
     * @param {number} [length] - The length of each piece.
     * @returns {Array<string>} - An array of chopped strings.
     */
    chop(str, length) {
        return v.chop(str, length);
    }

    /**
     * Counts the number of times `substring` appears in `str`.
     * @param {string} str - The input string.
     * @param {string} substring - The substring to count.
     * @returns {number} - The number of occurrences.
     */
    countSubstrings(str, substring) {
        return v.countSubstrings(str, substring);
    }

    /**
     * Escape HTML entities in `str`.
     * @param {string} str - The input string.
     * @returns {string} - The string with HTML entities escaped.
     */
    escapeHtml(str) {
        return v.escapeHtml(str);
    }

    /**
     * Unescape HTML entities in `str`.
     * @param {string} str - The input string.
     * @returns {string} - The string with HTML entities unescaped.
     */
    unescapeHtml(str) {
        return v.unescapeHtml(str);
    }

    /**
     * Checks if `str` is empty.
     * @param {string} str - The input string.
     * @returns {boolean} - True if `str` is empty, false otherwise.
     */
    isEmpty(str) {
        return v.isEmpty(str);
    }

    /**
     * Converts `str` to kebab case.
     * @param {string} str - The input string.
     * @returns {string} - The kebab-cased string.
     */
    kebabCase(str) {
        return v.kebabCase(str);
    }

    /**
     * Pads `str` on the left side if it is shorter than `length`.
     * @param {string} str - The input string.
     * @param {number} length - The desired length of the string.
     * @param {string} [pad] - The string to use for padding.
     * @returns {string} - The left-padded string.
     */
    padLeft(str, length, pad) {
        return v.padLeft(str, length, pad);
    }

    /**
     * Pads `str` on the right side if it is shorter than `length`.
     * @param {string} str - The input string.
     * @param {number} length - The desired length of the string.
     * @param {string} [pad] - The string to use for padding.
     * @returns {string} - The right-padded string.
     */
    padRight(str, length, pad) {
        return v.padRight(str, length, pad);
    }

    /**
     * Converts `str` to snake case.
     * @param {string} str - The input string.
     * @returns {string} - The snake-cased string.
     */
    snakeCase(str) {
        return v.snakeCase(str);
    }

    /**
     * Converts `str` to start case.
     * @param {string} str - The input string.
     * @returns {string} - The start-cased string.
     */
    startCase(str) {
        return v.startCase(str);
    }

    /**
     * Checks if `str` starts with `prefix`.
     * @param {string} str - The input string.
     * @param {string} prefix - The prefix to check for.
     * @param {number} [position] - The position to begin the search.
     * @returns {boolean} - True if `str` starts with `prefix`, false otherwise.
     */
    startsWith(str, prefix, position) {
        return v.startsWith(str, prefix, position);
    }

    /**
     * Strips HTML tags from `str`.
     * @param {string} str - The input string.
     * @returns {string} - The string with HTML tags removed.
     */
    stripHtml(str) {
        return v.stripTags(str); // Voca uses stripTags for this
    }

    /**
     * Converts `str` to a single word by removing all special characters and spaces.
     * @param {string} str - The input string.
     * @returns {string} - The stripped string.
     */
    stripPunctuation(str) {
        return v.stripPunctuation(str);
    }

    /**
     * Converts `str` to an array of characters.
     * @param {string} str - The input string.
     * @returns {Array<string>} - An array of characters.
     */
    chars(str) {
        return v.chars(str);
    }

    /**
     * Checks if `str` contains `substring`.
     * @param {string} str - The input string.
     * @param {string} substring - The substring to check for.
     * @param {number} [position] - The position to start the search.
     * @returns {boolean} - True if `str` contains `substring`, false otherwise.
     */
    includes(str, substring, position) {
        return v.includes(str, substring, position);
    }

    /**
     * Converts `str` to lower case.
     * @param {string} str - The input string.
     * @returns {string} - The lowercased string.
     */
    lowerCase(str) {
        return v.lowerCase(str);
    }

    /**
     * Converts `str` to upper case.
     * @param {string} str - The input string.
     * @returns {string} - The uppercased string.
     */
    upperCase(str) {
        return v.upperCase(str);
    }

    /**
     * Removes leading and trailing whitespace from `str`.
     * @param {string} str - The input string.
     * @returns {string} - The trimmed string.
     */
    trim(str) {
        return v.trim(str);
    }

    /**
     * Removes leading whitespace from `str`.
     * @param {string} str - The input string.
     * @returns {string} - The left-trimmed string.
     */
    trimLeft(str) {
        return v.trimLeft(str);
    }

    /**
     * Removes trailing whitespace from `str`.
     * @param {string} str - The input string.
     * @returns {string} - The right-trimmed string.
     */
    trimRight(str) {
        return v.trimRight(str);
    }
}

// To make the String class available globally in a classic JavaScript setup,
// you can assign it to the window object or another global namespace.
// For example:
// window.StringUtil = String;

/*
// Example Usage (assuming voca.min.js is loaded via a <script> tag before this script)

const stringProcessor = new String(); // Renamed from StringUtil to String for brevity as the class is named String

const myText = "  Hello world, this is a TEST string with special characters!@#  ";

console.log("Original:", myText);
console.log("Slugified:", stringProcessor.slugify(myText));
console.log("Formatted Filename:", stringProcessor.formatFileName(myText));
console.log("First Characters:", stringProcessor.getFirstCharacters(myText));
console.log("Replaced:", stringProcessor.replace(myText, "test", "demo"));

// Voca.js extensions
console.log("Capitalized:", stringProcessor.capitalize(myText));
console.log("Title Case:", stringProcessor.titleCase(myText));
console.log("Camel Case:", stringProcessor.camelCase("foo bar baz"));
console.log("Ends With '!',", stringProcessor.endsWith(myText, '!'));
console.log("Truncated:", stringProcessor.truncate(myText, 20));
console.log("Centered:", stringProcessor.center("abc", 9, '-'));
console.log("Chopped:", stringProcessor.chop("abcdef", 2));
console.log("Count 'is':", stringProcessor.countSubstrings(myText, 'is'));
console.log("Escaped HTML:", stringProcessor.escapeHtml("<div>Hello & World</div>"));
console.log("Unescaped HTML:", stringProcessor.unescapeHtml("&lt;div&gt;Hello &amp; World&lt;/div&gt;"));
console.log("Is Empty:", stringProcessor.isEmpty(""));
console.log("Kebab Case:", stringProcessor.kebabCase("Foo Bar Baz"));
console.log("Padded Left:", stringProcessor.padLeft("abc", 5, '0'));
console.log("Padded Right:", stringProcessor.padRight("abc", 5, '*'));
console.log("Snake Case:", stringProcessor.snakeCase("Foo Bar Baz"));
console.log("Start Case:", stringProcessor.startCase("foo-bar-baz"));
console.log("Starts With '  H':", stringProcessor.startsWith(myText, '  H'));
console.log("Stripped HTML:", stringProcessor.stripHtml("<p>Hello <b>World</b></p>"));
console.log("Stripped Punctuation:", stringProcessor.stripPunctuation("Hello, World! (123)"));
console.log("Chars:", stringProcessor.chars("abc"));
console.log("Includes 'world':", stringProcessor.includes(myText, 'world'));
console.log("Lower Case:", stringProcessor.lowerCase(myText));
console.log("Upper Case:", stringProcessor.upperCase(myText));
console.log("Trimmed:", stringProcessor.trim(myText));
console.log("Trimmed Left:", stringProcessor.trimLeft(myText));
console.log("Trimmed Right:", stringProcessor.trimRight(myText));

*/
