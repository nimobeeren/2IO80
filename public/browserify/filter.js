const fs = require("fs");
const mustache = require("mustache");
const programButtonTemplate = fs.readFileSync("views/program-button.mustache", "utf8");

// The list of programs
let programs = [];

// Which filters are being shown right now
let shownFilters = {};

// Elements used for displaying filter results
let template;
let program_list;

// Set checkboxes to call filter when changed
// Get all existing filter names and the values that need to be checked
let filters = [];
Array.from(document.querySelectorAll('.filters__item')).forEach(item => {
    let filterName = item.id.split('--')[1];
    let filterValues = getURLParameter(filterName);
    if (filterValues) {
        filters.push({
            name: filterName,
            values: filterValues.split(',')
        });
    }
});

// Check all required checkboxes
filters.forEach(filter => {
    // Get corresponding element
    let el = id('filters--' + filter.name);

    // Iterate over all its checkboxes
    Array.from(el.querySelectorAll('input[type="checkbox"]')).forEach(box => {
        if (filter.values.includes(box.getAttribute('value'))) {
            box.setAttribute('checked', 'true');
        }
    });
});

template = document.querySelector('.program-button');
program_list = document.querySelector('.program-list');
[].concat(document.querySelectorAll('[type="checkbox"]'))[0].forEach(checkbox => checkbox.onchange = filter);
if (program_list && program_list !== null) {
    filter();
}

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
    // TODO: generate this list from the database (might be difficult to get relevant content)
    let result = [
        {
            name: "Web Science",
            faculty: "mcs",
            degree: "Bachelor BSc",
            profile: ["nt", "ng"],
            interest: "science",
            language: "en",
            contents: "Over the past decade the use of web-based systems has exploded. Buying clothes, books, and DVDs, booking hotels, checking the weather forecast, contacting your friends: all...",
            title: "Web Science, BSc",
            url: "/program-wt"
        },
        {
            name: "Psychology & Technology",
            faculty: "pt",
            degree: "Bachelor BSc",
            profile: ["nt", "ng", "em", "cm"],
            interest: "science",
            language: "en",
            contents: "The games you play, the mobile phone you use to send text messages, the website where you do your online shopping. Technology is all around us, and is an important...",
            title: "Psychology & Technology, BSc",
            url: "/program-pt"
        },
        {
            name: "Human Technology Interaction",
            faculty: "pt",
            degree: "Master MSc",
            profile: ["nt", "ng", "em", "cm"],
            interest: "science",
            language: "en",
            contents: "Technological development offers new possibilities to make people's daily lives more healthy, safe, understandable, independent, fun and comfortable...",
            title: "Human Technology Interaction, MSc",
            url: "/program-hti"
        }, {
            name: "Computer Science and Engineering",
            faculty: "mcs",
            degree: "Master MSc",
            profile: ["nt", "ng"],
            interest: "science",
            language: "en",
            contents: "Software systems play an often unseen yet highly important role in our society. Consider, for example, the systems of banks or insurance companies, or the...",
            title: "Computer Science and Engineering, MSc",
            url: "/program-cse"
        }];

    // Get the allowed values for the current filter
    let allowedDegrees = [];
    let allowedFaculties = [];
    let allowedInterests = [];
    let allowedProfiles = [];
    let allowedLanguages = [];
    Array.from(document.querySelectorAll('.filters__item')).forEach(item => {
        Array.from(item.querySelectorAll('input[type="checkbox"]:checked')).forEach(checkbox => {
            if (item.id === 'filters--degree') {
                allowedDegrees.push(checkbox.value);
            } else if (item.id === 'filters--faculty') {
                allowedFaculties.push(checkbox.value);
            } else if (item.id === 'filters--interest') {
                allowedInterests.push(checkbox.value);
            } else if (item.id === 'filters--profile') {
                allowedProfiles.push(checkbox.value);
            } else if (item.id === 'filters--language') {
                allowedLanguages.push(checkbox.value);
            }
        })
    });

    // Filter out programs that do not fulfill the current filter
    if (allowedDegrees.length > 0 || allowedFaculties.length > 0 || allowedProfiles.length > 0 || allowedInterests.length > 0 || allowedLanguages.length > 0) {
        result = result.filter(program => {
            return (allowedDegrees.length === 0 || allowedDegrees.some(deg => program.degree.toLowerCase().split(' ').includes(deg.toLowerCase())))
                && (allowedFaculties.length === 0 || allowedFaculties.some(fac => program.faculty === fac))
                && (allowedInterests.length === 0 || allowedInterests.some(inter => program.interest === inter))
                && (allowedProfiles.length === 0 || allowedProfiles.some(prof => program.profile.includes(prof)))
                && (allowedLanguages.length === 0 || allowedLanguages.some(lang => program.language === lang));
        });
    }

    let resultHTML;

    // Show message if result is empty
    if (result.length === 0) {
        resultHTML = '<p>No results were found for the selected filters. Please make a different selection.</p>';
    } else {
        resultHTML = '';
    }

    // Remove all old program buttons
    Array.from(document.querySelectorAll('.program-button')).forEach(el => el.remove());
    // Add the program buttons for the result
    result.forEach(result => {
        resultHTML += mustache.render(programButtonTemplate, {
            title: result.title,
            contents: result.contents,
            url: result.url,
            language: result.language == "en" ? "English" : "Dutch",
            degree: result.degree
        });
    });

    program_list.innerHTML = resultHTML;
}
