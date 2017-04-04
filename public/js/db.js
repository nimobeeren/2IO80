// Initialize and update search database
let pages = [];
updateDB();

/**
 * Retrieves the search database
 */
function updateDB() {
    openUrl("GET", "api/newcache", {
            success: res => {
                try {
                    pages = JSON.parse(res);
                    window.onload && window.onload();
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
