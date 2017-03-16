let pages = [];

/** Search query evaluation logic:
 *
 * Split the query into individual words, count the occurrences of the word in the page.
 * The sum of the words of the query in the page is the evaluation of the query.
 *
 * Splitting of the query into individual words is not done for the contents evaluation,
 * because of words like "the, a, is" etc..
 *
 * */
const evaluateTitle = (p, q) => q.split(" ").reduce((s, w) => s + (p.title.match(new RegExp(w, "gi")) || []).length, 0);
const evaluateHeadings = (p, q) => q.split(" ").reduce((s, w) => s + p.headings.reduce((s, c) => s + (c.match(new RegExp(w, "gi")) || []).length, 0), 0);
const evaluateContent = (p, q) => (p.contents.match(new RegExp(q, "gi")) || []).length;

// Retrieve page database
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

// Search the pages database, sorting results by relevance
function search(query) {
    // Check if database is empty
    if (pages.length == 0) {
        // Give feedback when searching on an empty database
        return log("Search database has not been updated");
    } else {
        // Store starting time
        let start = new Date().getTime();

        let search = pages.sort((a, b) => {
            // Count occurrences of query in title of pages
            let aTitle = evaluateTitle(a, query);
            let bTitle = evaluateTitle(b, query);

            // If title count is equal, look at the headings
            if (aTitle == bTitle) {
                // Count occurrences of query in headings of pages
                let aHeadings = evaluateHeadings(a, query);
                let bHeadings = evaluateHeadings(b, query);

                // If heading count is equal, look at the contents
                if (aHeadings == bHeadings) {
                    // Count occurrences of query in contents of pages
                    let aContent = evaluateContent(a, query);
                    let bContent = evaluateContent(b, query);

                    // Decide order based on content occurrences
                    return bContent - aContent;
                }
                // Decide order based on heading occurrences
                return bHeadings - aHeadings;
            }
            // Decide order based on title occurrences
            return bTitle - aTitle;
        }).map(x => syntaxHighlight(JSON.stringify(x))).slice(0, 9);

        // Calculate running time
        let run = new Date().getTime() - start;

        // Return running time
        return "Took: " + run + "ms <br>" + search;
    }
}

/** For testing only */
id('search') ? id('search').oninput = () => id('search_result').innerHTML = search(id('search').value) : 0;

