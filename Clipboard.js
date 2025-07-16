(function($) {
    $.fn.clipboard = function(options) {
        // Default settings
        var settings = $.extend({
            outputText: 'Default Output Text' // Configurable option
        }, options);
        // Main functionality
        this.each(function() {
            var $element = $(this);
            $element.on('click', function() {
                const resultInput = document.getElementById(settings.outputText); // Use the configurable outputText
                resultInput.select();
                document.execCommand("copy");
                resultInput.setSelectionRange(0, 99999); // For mobile
                const cb = JSON.parse(localStorage.getItem("clipboard"));
                cb = resultInput.value;
                navigator.clipboard.writeText(cb).then(() => {
                    //alert("Copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy.");
                    console.error(err);
                });
                // Log the outputText
                console.log(settings.outputText);
            });
        });
        return this; // Maintain jQuery chainability
    };
}(jQuery));