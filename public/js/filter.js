// Define the list of programs
let programs = [];

// Set checkboxes to call filter when clicked
window.onload = () => {
    [...id('filter-profile').children].forEach(checkbox => checkbox.onclick = filter);
    filter();
};

/**
 * Displays a subset of programs based on the selected filters
 */
function filter() {
    // Populate the programs list using the database
    if (pages.length == 0) {
        return log("The database has not been updated");
    } else {
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

    // Get a list of allowed profiles
    let allowedProfiles = [];
    id('filter-profile').querySelectorAll('[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            allowedProfiles.push(checkbox.value);
        }
    });

    // Filters out all programs that do not contain any of the allowed profiles
    id('filter_result').innerHTML = programs.filter(program =>
        allowedProfiles.some(profile => program.profile.includes(profile)))
        .map(x => syntaxHighlight(JSON.stringify(x)));
}
