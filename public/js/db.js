// Initialize and update search database
let pages = [];
updateDB();

// Retrieve page database
function updateDB() {
    openUrl("GET", "api/cache", {
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
