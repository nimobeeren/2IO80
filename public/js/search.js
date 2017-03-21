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
 * Split the query into individual words, count the occurrences of the word in the title,
 * headings and content. To sort by relevance we first look at the title occurrences, if they are
 * equal, we look at the headings, if that is also equal, we look at the content.
 * In addition, we use PageRank in our sorting process. This is weighted so that it will
 * almost never be the deciding factor. It is used to find small differences in relevance
 * between pages that would otherwise be equal.
 *
 * Common words defined above are ignored altogether.
 *
 * */
const evaluateTitle = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? s + (p.title.match(new RegExp(w, "gi")) || []).length : 0, 0);
const evaluateHeadings = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? s + p.headings.reduce((s, c) => s + (c.match(new RegExp(w, "gi")) || []).length, 0) : 0, 0);
const evaluateContent = (p, q) => q.split(" ").reduce((s, w) => !ignore[w.toLowerCase()] ? (s + (p.contents.match(new RegExp(w, "gi")) || []).length) : 0, 0);

// PageRank implementation
const linkFrequency = {};
pages.forEach(page => {
    page.links.forEach(link => {
        linkFrequency[link] = linkFrequency[link] ? linkFrequency[link] + 1 : 1;
    })
});

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
                        startSearch(corrected.trim(), startCorrect);
                    }
                },
                error: res => {
                    console.log(res);
                }
            });
        });
    }
}


function startSearch(query, startCorrect) {
    // Store starting time
    let startSearch = new Date().getTime();

    let search = pages.sort((a, b) => {
        // Count occurrences of query in title of pages
        a.score = evaluateTitle(a, query);
        b.score = evaluateTitle(b, query);
        a.relevance = a.score * 100;
        b.relevance = b.score * 100;
        // If title count is equal, look at the headings
        if (a.score == b.score) {
            // Count occurrences of query in headings of pages
            a.score = evaluateHeadings(a, query);
            b.score = evaluateHeadings(b, query);
            a.relevance += a.score * 10;
            b.relevance += b.score * 10;
            // If heading count is equal, look at the contents
            if (a.score == b.score) {
                // Count occurrences of query in contents of pages
                a.score = evaluateContent(a, query);
                b.score = evaluateContent(b, query);
                a.relevance += a.score;
                b.relevance += b.score;
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
