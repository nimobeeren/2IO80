let pages = [];

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
        console.log("Search database has not been updated");
    } else {
        return pages.sort((a, b) => {
            console.log(a, b);
            let aTitle = (a.title.match(new RegExp(query, "gi")) || []).length;
            let bTitle = (b.title.match(new RegExp(query, "gi")) || []).length;
            if (aTitle == bTitle) {
                let aHeadings = a.headings.reduce((sum, cur) => sum + (cur.match(new RegExp(query, "gi")) || []).length, 0);
                let bHeadings = b.headings.reduce((sum, cur) => sum + (cur.match(new RegExp(query, "gi")) || []).length, 0);
                if (aHeadings == bHeadings) {
                    let aContent = (a.contents.match(new RegExp(query, "gi")) || []).length;
                    let bContent = (b.contents.match(new RegExp(query, "gi")) || []).length;
                    return bContent - aContent;
                }
                return bHeadings - aHeadings;
            }
            return bTitle - aTitle;
        });
    }
}
