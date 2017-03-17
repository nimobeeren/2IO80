// Initialize and update search database
let pages = [];
updateDB();

// Define common words to ignore when searching
let ignore = {
    the: true,
    be: true,
    of: true,
    and: true,
    a: true,
    in: true,
    that: true,
    have: true,
    i: true,
    it: true,
    for: true,
    not: true,
    on: true,
    with: true,
    he: true,
    as: true,
    you: true,
    do: true,
    at: true
};

/** Search query evaluation logic:
 *
 * Split the query into individual words, count the occurrences of the word in the page.
 * The sum of the words of the query in the page is the evaluation of the query.
 *
 * Common words defined above are ignored altogether
 *
 * */
const evaluateTitle = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? s + (p.title.match(new RegExp(w, "gi")) || []).length : 0, 0);
const evaluateHeadings = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? s + p.headings.reduce((s, c) => s + (c.match(new RegExp(w, "gi")) || []).length, 0) : 0, 0);
const evaluateContent = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? s + (p.contents.match(new RegExp(w, "gi")) || []).length : ignore[w], 0);

// Retrieve page database
function updateDB() {
    openUrl("GET", "api/cache", {
            callback: res => {
                try {
                    pages = JSON.parse(res);
                } catch (e) {
                    console.log(e);
                }
            },
            error: res => {
                console.log(res);
            }
        }
    );
}

// Search the pages database, sorting results by relevance
function search(query) {
    // Check if database is empty
    if (pages.length == 0) {
        // Give feedback when searching on an empty database
        return log("Search database has not been updated");
    } else {
        // Store starting time
        let start = new Date().getTime();
        // PageRank implementation
        let linkFrequency = {};
        pages.forEach(page => {
            page.links.forEach(link => {
                linkFrequency[link] = linkFrequency[link] ? linkFrequency[link] + 1 : 1;
            })
        });

        let search = pages.sort((a, b) => {
            // Count occurrences of query in title of pages
            a.score = evaluateTitle(a, query);
            b.score = evaluateTitle(b, query);
            // If title count is equal, look at the headings
            if (a.score == b.score) {
                // Count occurrences of query in headings of pages
                a.score = evaluateHeadings(a, query);
                b.score = evaluateHeadings(b, query);
                // If heading count is equal, look at the contents
                if (a.score == b.score) {
                    // Count occurrences of query in contents of pages
                    a.score = evaluateContent(a, query);
                    b.score = evaluateContent(b, query);
                }
            }
            b.pageRank = (linkFrequency[b.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;
            a.pageRank = (linkFrequency[a.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;

            // Decide order based on overall occurrences
            return (b.score + b.pageRank) - (a.score + a.pageRank);
        }).map(x => "<pre>" + syntaxHighlight(JSON.stringify(x, null, 20)) + "</pre>");
        // Calculate running time
        let run = new Date().getTime() - start;

        // Return running time
        return "Took: " + run + "ms <br>" + search;
    }
}

/** For testing only */
id('search') ? id('search').oninput = () => id('search_result').innerHTML = search(id('search').value.trim()) : 0;

