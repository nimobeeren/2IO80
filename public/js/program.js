let shownItems = {};

window.onload = () => {
    // Set desktop content
    document.getElementsByClassName('accordion__desktop-content')[0].innerHTML
        = document.getElementsByClassName('accordion__content')[0].innerHTML;
};

function toggleAccordion(element) {
    let el = id(element);
    if (shownItems[element]) {
        // Hide the item
        el.getElementsByClassName('accordion__content')[0].style.display = 'none';
        el.getElementsByClassName('accordion__expand-button')[0].innerHTML = '+';
        shownItems[element] = false;
    } else {
        // Show the item
        el.getElementsByClassName('accordion__content')[0].style.display = 'block';
        el.getElementsByClassName('accordion__expand-button')[0].innerHTML = '-';
        shownItems[element] = true;
    }

    // Update the desktop content
    document.getElementsByClassName('accordion__desktop-content')[0].innerHTML
        = el.getElementsByClassName('accordion__content')[0].innerHTML;
}
