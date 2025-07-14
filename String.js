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
}