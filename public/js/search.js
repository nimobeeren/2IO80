// Automatically search whenever input changes
window.onload = () =>
    id('search').oninput = () => {
        let query = id('search').value.trim();
        query && search(query);
    };

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
const evaluateContent = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? (s + (p.contents.match(new RegExp(w, "gi")) || []).length) : 0, 0);

// Search the pages database, sorting results by relevance
function search(query) {
    // Trim spaces from query
    query = query.trim();

    // Check if database is empty
    if (pages.length == 0) {
        // Give feedback when searching on an empty database
        return log("The database has not been updated");
    } else {
        // Store starting time
        let startCorrect = new Date().getTime();

        // Correct the search query
        let corrected = '';
        let words = query.split(" ");
        let correctedWords = 0;
        words.forEach(x => {
            openUrl("get", "api/correct/" + x, {
                success: (x) => {
                    corrected += x + ' ';
                    correctedWords++;
                    if (correctedWords == words.length) {
                        startSearch(corrected.trim());
                    }
                },
                error: res => {
                    console.log(res);
                }
            })
        });

        // Start searching using the corrected query
        function startSearch(query) {
            // Store starting time
            let startSearch = new Date().getTime();

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
                a.pageRank = (linkFrequency[a.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;
                b.pageRank = (linkFrequency[b.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;

                // Decide order based on overall occurrences
                return (b.score + b.pageRank) - (a.score + a.pageRank);
            }).map(x => "<pre>" + syntaxHighlight(JSON.stringify(x, null, 20)) + "</pre>").slice(0, 9);

            // Calculate running time
            let endSearch = new Date().getTime();
            let correctTime = startSearch - startCorrect;
            let searchTime = endSearch - startSearch;

            // Return running time
            id('search_result').innerHTML = "Searched for: " + query + " <br> Correct took: " + correctTime + " ms <br> Search took: " + searchTime + "ms <br>" + search;
        }
    }
}
