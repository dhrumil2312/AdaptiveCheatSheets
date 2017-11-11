$(function() {

    function em(numberOfEms) {
        var currentEmSize = parseFloat($('body').css('font-size'));
        return (currentEmSize * numberOfEms);
    }

    $('#formWrapper').hide();
    $('#help').hide();
    $('#aboutWindow').hide();
    $('#recycleBin').hide();

    $('#help article').accordion({
        active:         false,
        collapsible:    true,
        header:         "h2",
        heightStyle:    "content",
        icons:          false
    });

});
