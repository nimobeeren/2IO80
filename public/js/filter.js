// The list of programs
let programs = [];

// Which filters are being shown right now
let shownFilters = {};

let template;
let program_list;

// Set checkboxes to call filter when changed
window.onload = () => {
    template = document.querySelector('.program-button');
    program_list = document.querySelector('.program-list');
    [].concat(document.querySelectorAll('[type="checkbox"]'))[0].forEach(checkbox => checkbox.onchange = filter);
    filter();
};

/**
 * Shows and hides the filter options
 * @param element the filter options to toggle
 */
function toggleFilter(element) {
    let el = id(element);
    if (shownFilters[element]) {
        el.querySelector('.filters__options').style.display = 'none';
        el.querySelector('.filters__expand-button').innerHTML = '+';
        shownFilters[element] = false;
    } else {
        el.querySelector('.filters__options').style.display = 'block';
        el.querySelector('.filters__expand-button').innerHTML = '-';
        shownFilters[element] = true;
    }
}

/**
 * Displays a subset of programs based on the selected filters
 */
function filter() {
    // Populate the programs list using the database
    if (pages.length === 0) {
        return log("The database has not been updated");
    } else if (programs.length === 0) {
        // Populate the programs list
        pages.forEach(page => {
            // Check whether current program exists in programs list
            let found = false;
            programs.forEach(program => {
                if (program.name === page['program']) {
                    found = true;
                }
            });

            // If it doesn't exist, add it to the list
            if (!found) {
                programs.push({
                    name: page['program'],
                    profile: page['profile'],
                    interest: page['interest'],
                    language: page['language'],
                    contents: page['contents'],
                    title: page['title'],
                    url: page['url']
                });
            }
        });
    }

    // Loop over all filters
    let result = programs;
    // Get the allowed values for the current filter
    let profiles = [];
    let interests = [];
    [].concat(document.querySelectorAll('input[type="checkbox"]:checked'))[0].forEach(checkbox => {
        if (checkbox.value.length > 2) {
            interests.push(checkbox.value);
        } else if (checkbox.value != 'en') {
            profiles.push(checkbox.value);
        }
    });

    // Filter out programs that do not fulfill the current filter
    if (profiles.length > 0 || interests.length > 0)
        result = result.filter(program => !profiles.includes('nl') && (profiles.length == 0 || profiles.every(profile => program.profile.includes(profile)))
        && (interests.length == 0 || interests.every(interest => program.interest.includes(interest))));


    program_list.innerHTML = '';

    template.remove();

    result.forEach(result => {
        template.children[0].children[0].innerHTML = result.title;
        template.children[0].children[1].innerHTML = result.contents.substring(0, 200);
        program_list.appendChild(template.cloneNode(true));
    });
}
