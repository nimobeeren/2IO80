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

function search(query) {
    if (pages.length == 0) {
        return log("Search database has not been updated");
    } else {
        let start = new Date().getTime();

        let search = pages.sort((a, b) => {
            let aTitle = evaluateTitle(a, query), bTitle = evaluateTitle(b, query);

            if (aTitle == bTitle) {
                let aHeadings = evaluateHeadings(a, query), bHeadings = evaluateHeadings(b, query);

                if (aHeadings == bHeadings) {
                    return evaluateContent(b, query) - evaluateContent(a, query);
                }
                return bHeadings - aHeadings;
            }
            return bTitle - aTitle;
        }).map(x => syntaxHighlight(JSON.stringify(x))).slice(0, 9);

        let run = new Date().getTime() - start;

        return "Took: " + run + "ms <br>" + search;
    }
}

/** For testing only */
id('search') ? id('search').oninput = () => id('search_result').innerHTML = search(id('search').value) : 0;

