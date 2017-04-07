let shownItems = {};

window.onload = () => {
    // Set accordion desktop content
    document.getElementsByClassName('accordion__desktop-content')[0].innerHTML
        = document.getElementsByClassName('accordion__content')[0].innerHTML;

    // Set switch menu default item
    // showSwitchMenu(document.getElementsByClassName('switch-menu__item')[0].getAttribute('data-subject'));
};

function toggleAccordion(element) {
    let el = id(element);
    if (shownItems[element]) {
        // Hide the item
        el.getElementsByClassName('accordion__content')[0].style.display = 'none';
        el.getElementsByClassName('accordion--expand')[0].innerHTML = '+';
        shownItems[element] = false;
    } else {
        // Show the item
        el.getElementsByClassName('accordion__content')[0].style.display = 'block';
        el.getElementsByClassName('accordion--expand')[0].innerHTML = '-';
        shownItems[element] = true;
    }

    // Update the desktop content
    document.getElementsByClassName('accordion__desktop-content')[0].innerHTML
        = el.getElementsByClassName('accordion__content')[0].innerHTML;
}

function showSwitchMenu(subject) {
    // Hide and show the correct content
    [...document.getElementsByClassName('switch-menu__content')].forEach(el => {
        if(el.getAttribute('data-subject') === subject) {
            // Show the desired item
            el.style.display = 'block';
        } else {
            // Hide all other items
            el.style.display = 'none';
        }
    });

    // Put emphasis on the selected item
    [...document.getElementsByClassName('switch-menu__item')].forEach(el => {
        if(el.getAttribute('data-subject') === subject) {
            // Put emphasis on the item
            el.style.color = '#4A4A4A'; // color-black
            el.style.borderColor = '#7F7F7F'; // color-grey
        } else {
            // Don't put emphasis on the item
            el.style.color = '#7F7F7F'; // color-grey
            el.style.borderColor = '#F3F3F3'; // color-grey-light
        }
    });
}
showSwitchMenu('jobs');
