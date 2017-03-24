let shownItems = {};

window.onload = () => {
    // DESKTOP
    // shownItems[document.getElementsByClassName('accordion__item')[0].id] = true;
    document.getElementsByClassName('')
};

function toggleAccordion(element) {
    // MOBILE
    let el = id(element);
    if (shownItems[element]) {
        // Hide the item
        el.getElementsByClassName('accordion__items__single__content')[0].style.display = 'none';
        el.getElementsByClassName('accordion__items__single__header__expand-button')[0].innerHTML = '+';
        shownItems[element] = false;
    } else {
        // Show the item
        el.getElementsByClassName('accordion__items__single__content')[0].style.display = 'block';
        el.getElementsByClassName('accordion__items__single__header__expand-button')[0].innerHTML = '-';
        shownItems[element] = true;
    }
}
