// The list of programs
let programs = [];

// Which filters are being shown right now
let shownFilters = {};

// Set checkboxes to call filter when clicked
window.onload = () => {
    document.querySelectorAll('[type="checkbox"]').forEach(checkbox => checkbox.onclick = filter);
    filter();
};

/**
 * Shows and hides the filter options
 * @param element the filter options to toggle
 */
function toggleFilter(element) {
    if (shownFilters[element]) {
        id(element).style.display = 'none';
        shownFilters[element] = false;
    } else {
        id(element).style.display = 'block';
        shownFilters[element] = true;
    }
}

/**
 * Displays a subset of programs based on the selected filters
 */
function filter() {
    // Populate the programs list using the database
    if (pages.length == 0) {
        return log("The database has not been updated");
    } else if (programs.length != 0) {
        pages.forEach(page => {
            // Check whether current program exists in programs list
            let found = false;
            programs.forEach(program => {
                if (program.name == page['program']) {
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
    [...document.getElementsByTagName('form')].forEach(form => {
        // Get the allowed values for the current filter
        let allowedValues = [];
        form.querySelectorAll('[type=checkbox').forEach(checkbox => {
            if (checkbox.checked) {
                allowedValues.push(checkbox.value);
            }
        });

        // Filter out programs that do not fulfill the current filter
        result = result.filter(program => allowedValues.some(val => program[form.name].includes(val)));
    });

    // Display result nicely formatted
    id('filter_result').innerHTML = result.map(x => syntaxHighlight(JSON.stringify(x)));

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
