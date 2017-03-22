// Automatically search whenever input changes
window.onload = () => {
    new SearchOverlay().bind('#search', '#search_result');
};

function SearchOverlay() {
    if (!window) throw "window not defined";

    this.bind = (input, button, resultCallback = this.defaultCallback) => {
        if (!input || !button) throw "An input and button selector or element are required";

        this.input = input;
        this.button = button;

        if (typeof input == 'string') {
            this.input = document.querySelector(input);
        }
        if (typeof button == 'string') {
            this.button = document.querySelector(button);
        }

        this.resultCallback = resultCallback;

        this.button.onclick = () => this.search(this.input.value, this.resultCallback);
        this.input.onkeydown = e => e.keyCode == 13 && this.search(this.input.value, this.resultCallback) || true;


    };
    this.defaultCallback = result => {
        this.body.innerHTML = result;
        document.body.appendChild(this.overlay);
    };
    this.create = e => document.createElement(e);

    this.overlay = this.create('e');
    /** TODO: make a class instead */
    this.overlay.style.position = 'fixed';
    this.overlay.style.width = this.overlay.style.height = '100%';
    this.overlay.style.top = 0;
    this.overlay.style.background = 'rgba(128, 128, 128, 0.47)';
    this.overlay.style.textAlign = 'center';

    this.body = this.create('b');
    /** TODO: make a class instead */
    this.body.style.width = '80%';
    this.body.style.height = '100%';
    this.body.style.background = 'rgba(255, 255, 255, 0.70)';
    this.body.style.display = 'inline-block';
    this.body.style.overflow = 'auto';

    this.close = this.create('x');
    /** TODO: make a class instead */
    this.close.innerHTML = "X";
    this.close.style.position = 'absolute';
    this.close.style.fontSize = '25px';
    this.close.onclick = () => this.overlay.remove();

    this.overlay.appendChild(this.close);
    this.overlay.appendChild(this.body);


    this.result = this.create('w');
    this.title = this.create('h2');
    this.content = this.create('p');
    this.result.appendChild(this.title);
    this.result.appendChild(this.content);


    this.getPages = () => {
        openUrl("get", "api/cache", {
                success: res => {
                    this.pages = JSON.parse(res);
                    // PageRank implementation
                    if (!this.linkFrequency) {
                        this.linkFrequency = {};
                    }
                    if (Object.keys(this.linkFrequency).length === 0 && this.linkFrequency.constructor === Object) {
                        this.pages.forEach(page => {
                            page.links.forEach(link => {
                                this.linkFrequency[link] = this.linkFrequency[link] ? this.linkFrequency[link] + 1 : 1;
                            })
                        });
                    }
                }
            }
        );
    };

    if (!this.pages) {
        this.getPages();
    }

    /** Search query evaluation logic:
     *
     * Split the query into individual words, auto-correct if necessary, count the occurrences of the word in the title,
     * headings and content. To sort by relevance we first look at the title occurrences, if they are
     * equal, we look at the headings, if that is also equal, we look at the content.
     * In addition, we use PageRank in our sorting process. This is weighted so that it will
     * almost never be the deciding factor. It is used to find small differences in relevance
     * between pages that would otherwise be equal.
     *
     * Common words defined above are ignored altogether.
     *
     * */

    // Define common words to ignore when searching
    this.ignore = {
        the: true, be: true, of: true, and: true, a: true, in: true,
        that: true, have: true, i: true, it: true, for: true,
        not: true, on: true, with: true, he: true, as: true, you: true,
        do: true, at: true
    };

    this.evaluateTitle = (p, q) => q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? s + (p.title.match(new RegExp(w, "gi")) || []).length : 0, 0);
    this.evaluateHeadings = (p, q) => q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? s + p.headings.reduce((s, c) => s + (c.match(new RegExp(w, "gi")) || []).length, 0) : 0, 0);
    this.evaluateContent = (p, q) => q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? (s + (p.contents.match(new RegExp(w, "gi")) || []).length) : 0, 0);

    // Search the pages database, sorting results by relevance
    this.search = (query, callback) => {
        // Trim spaces from query
        query = query.trim();

        // Check if database is empty
        if (pages.length == 0) {
            // Give feedback when searching on an empty database
            return log("The database has not been updated");
        } else {
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
                            this.startSearch(corrected.trim(), callback);
                        }
                    }
                });
            });
        }
    };

    this.startSearch = (query, callback) => {
        this.results = this.pages.sort((a, b) => {
            // Count occurrences of query in title of pages
            a.score = this.evaluateTitle(a, query);
            b.score = this.evaluateTitle(b, query);
            a.relevance = a.score * 100;
            b.relevance = b.score * 100;
            // If title count is equal, look at the headings
            if (a.score == b.score) {
                // Count occurrences of query in headings of pages
                a.score = this.evaluateHeadings(a, query);
                b.score = this.evaluateHeadings(b, query);
                a.relevance += a.score * 10;
                b.relevance += b.score * 10;
                // If heading count is equal, look at the contents
                if (a.score == b.score) {
                    // Count occurrences of query in contents of pages
                    a.score = this.evaluateContent(a, query);
                    b.score = this.evaluateContent(b, query);
                    a.relevance += a.score;
                    b.relevance += b.score;
                }
            }
            a.pageRank = (this.linkFrequency[a.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;
            b.pageRank = (this.linkFrequency[b.url.replace("https://studyguide.tue.nl", '')] || 0) / 4;

            // Decide order based on overall occurrences
            return (b.score + b.pageRank) - (a.score + a.pageRank);
        }).map(x => {
            this.title.innerHTML = x.title;
            this.content.innerHTML = x.contents.substr(0, 100);
            return this.result.outerHTML;
        }).slice(0, 9).reduce((acc, v) => acc + v, '');
        callback(this.results);
    };

}

