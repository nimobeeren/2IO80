// The list of programs
let programs = [];

// Which filters are being shown right now
let shownFilters = {};

// Set checkboxes to call filter when changed
window.onload = () => {
    [].concat(document.querySelectorAll('[type="checkbox"]')).forEach(checkbox => checkbox.onchange = filter);
    filter();
};

/**
 * Shows and hides the filter options
 * @param element the filter options to toggle
 */
function toggleFilter(element) {
    let el = id(element);
    if (shownFilters[element]) {
        el.querySelector('.filter__options').style.display = 'none';
        el.querySelector('.filter__header__expand-button').innerHTML = '+';
        shownFilters[element] = false;
    } else {
        el.querySelector('.filter__options').style.display = 'block';
        el.querySelector('.filter__header__expand-button').innerHTML = '-';
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
                    language: page['language']
                });
            }
        });
    }

    // Loop over all filters
    let result = programs;
    [].concat(document.getElementsByTagName('form')).forEach(form => {
        // Get the allowed values for the current filter
        let allowedValues = [];
        [].concat(form.querySelectorAll('[type=checkbox')).forEach(checkbox => {
            if (checkbox.checked) {
                allowedValues.push(checkbox.value);
            }
        });

        // Filter out programs that do not fulfill the current filter
        result = result.filter(program => allowedValues.some(val => program[form.name].includes(val)));
    });

    // Display result nicely formatted
    //id('filter_result').innerHTML = result.map(x => syntaxHighlight(JSON.stringify(x)));

    // Get a list of allowed profiles
    // let allowedProfiles = [];
    // id('filter-profile').querySelectorAll('[type="checkbox"]').forEach(checkbox => {
    //     if (checkbox.checked) {
    //         allowedProfiles.push(checkbox.value);
    //     }
    // });
    //
    // // Filters out all programs that do not contain any of the allowed profiles
    // id('filter_result').innerHTML = programs.filter(program =>
    //     allowedProfiles.some(profile => program.profile.includes(profile)))
    //     .map(x => syntaxHighlight(JSON.stringify(x)));
}
