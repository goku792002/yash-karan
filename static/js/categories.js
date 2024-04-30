function toggle(id) {
    var element = $('#' + id);
    if (element.hasClass('visible')) {
        element.removeClass('visible').slideUp(800); // Hide and remove the class
    } else {
        element.addClass('visible').hide().slideDown(800); // Show and add the class for visibility
    }
}

function setTab(tabName) {
    // Logic to highlight selected tab and fetch data if needed
    console.log('Setting tab to:', tabName);
}
