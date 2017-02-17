/**
 *
 * @param type
 * @param url
 * @param params
 * @param callback
 * @param error
 */
function openUrl(type, url, {params, callback, error}) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        type == 'post' && xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        xhr.onreadystatechange = function () {
            this.readyState == 4 && this.status == 200 && callback(this.responseText);
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
 * Only for testing.
 * source: http://stackoverflow.com/a/7220510
 * */
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
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