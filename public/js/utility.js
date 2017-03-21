/**
 * Makes a HTTP request to specified URL
 * @param type
 * @param url
 * @param params
 * @param success
 * @param error
 */
function openUrl(type, url, {params, success, error}) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        type == 'post' && xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        xhr.onreadystatechange = function () {
            this.readyState == 4 && this.status == 200 && success(this.responseText);
            this.readyState == 4 && this.status != 200 && error(this.responseText);
        };
    } catch (ex) {
        error(ex);
    }
    return true;
}

function id(id) {
    return document.getElementById(id);
}

const log = (...args) => {
    console.log(...args);
    return [...args].join(" ");
};

/**
 * Formats a JSON string with nice colors (for testing)
 * source: http://stackoverflow.com/a/7220510
 * */
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    json = "<div class='json'>" + json + "</div>";
    return json;
}
