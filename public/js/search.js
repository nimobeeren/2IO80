// Automatically search whenever input changes
new SearchOverlay().bind(document.getElementById('search-field-input'), document.getElementById('search-field-button'), document.getElementById('search-overlay'), document.getElementById('search_result'),
    document.getElementsByClassName('search-overlay__close')[0]);

function SearchOverlay() {
    if (!window) throw "window not defined";

    this.bind = (input, button, overlay, resultHTML, closeButton, resultCallback = this.defaultCallback) => {
        if (!input || !button) throw "An input and button selector or element are required";

        this.input = input;
        this.button = button;
        this.overlay = overlay;
        this.resultHTML = resultHTML;
        this.closeButton = closeButton;

        document.getElementsByClassName('header__search')[0].onclick = () => this.overlay.open = 1;


        if (typeof input === 'string') {
            this.input = document.querySelector(input);
        }
        if (typeof button === 'string') {
            this.button = document.querySelector(button);
        }

        this.resultCallback = resultCallback;

        this.button.onclick = e => e.preventDefault() || this.search(this.input.value, this.resultCallback);
        this.input.onkeydown = e => e.keyCode === 13 && this.search(this.input.value, this.resultCallback) || true;
        this.closeButton.onclick = () => this.overlay.open = 0;
    };

    this.defaultCallback = result => {
        this.resultHTML.innerHTML = result;
    };
    this.create = e => document.createElement(e);

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
                            page.links && page.links.forEach(link => {
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

    this.evaluateTitle = (p, q) => p.title ? q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? s + (p.title.match(new RegExp(w, "gi")) || []).length : 0, 0) : 0;
    this.evaluateHeadings = (p, q) => p.headings ? q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? s + p.headings.reduce((s, c) => s + (c.match(new RegExp(w, "gi")) || []).length, 0) : 0, 0) : 0;
    this.evaluateContent = (p, q) => p.contents ? q.split(" ").reduce((s, w) => !this.ignore[w.toLowerCase()] ? (s + (p.contents.match(new RegExp(w, "gi")) || []).length) : 0, 0) : 0;

    // Search the pages database, sorting results by relevance
    this.search = (query, callback, shouldCorrect = 1) => {
        // Trim spaces from query
        query = query.trim();

        // Check if database is empty
        if (this.pages.length === 0) {
            this.getPages();
            // Give feedback when searching on an empty database
            return log("The database has not been updated");
        } else {
            // Correct the search query
            if (shouldCorrect) {
                let corrected = '';
                let words = query.toLowerCase().split(" ");
                let correctedWords = 0;
                words.forEach(x => {
                    openUrl("get", "api/correct/" + x, {
                        success: (x) => {
                            corrected += x + ' ';
                            correctedWords++;
                            if (correctedWords === words.length) {
                                this.startSearch(corrected.trim(), query.trim().toLowerCase() !== corrected.trim().toLowerCase(), query, callback);
                            }
                        }
                    });
                });
            } else {
                this.startSearch(query, shouldCorrect, query, callback);
            }
        }
    };

    this.startSearch = (query, isCorrected, originalQuery, callback) => {
        /** Very beautiful code */
        if (isCorrected) {
            this.results = '<p>' +
                'Showing results for: <b>' + query + '</b>. '
                + 'Search instead for: <a href=# class="search_instead_link" id="idk">' + originalQuery + '</a>' +
                '</p>';
            setTimeout(() => document.getElementById('idk').onclick = () => this.startSearch(originalQuery, 0, originalQuery, callback), 0);
        } else {
            this.results = '';
        }
        this.results += this.pages ? this.pages.sort((a, b) => {
            // Count occurrences of query in title of pages
            a.score = this.evaluateTitle(a, query);
            b.score = this.evaluateTitle(b, query);
            a.relevance = a.score * 100;
            b.relevance = b.score * 100;
            // If title count is equal, look at the headings
            if (a.score === b.score) {
                // Count occurrences of query in headings of pages
                a.score = this.evaluateHeadings(a, query);
                b.score = this.evaluateHeadings(b, query);
                a.relevance += a.score * 10;
                b.relevance += b.score * 10;
                // If heading count is equal, look at the contents
                if (a.score === b.score) {
                    // Count occurrences of query in contents of pages
                    a.score = this.evaluateContent(a, query);
                    b.score = this.evaluateContent(b, query);
                    a.relevance += a.score;
                    b.relevance += b.score;
                }
            }
            a.pageRank = a.url ? (this.linkFrequency[a.url.replace("https://studyguide.tue.nl", '')] || 0) / 4 : 0;
            b.pageRank = a.url ? (this.linkFrequency[b.url.replace("https://studyguide.tue.nl", '')] || 0) / 4 : 0;

            // Decide order based on overall occurrences
            return (b.score + b.pageRank) - (a.score + a.pageRank);
        }).slice(0, 9).map(x => {
            this.title.innerHTML = x.title || "No title found!";
            this.content.innerHTML = x.contents ? x.contents.substr(0, 100) : "No contents found!";
            return this.result.outerHTML;
        }).reduce((acc, v) => acc + v, '') : 'No results found!';
        this.getPages();
        callback(this.results);
    };

}

