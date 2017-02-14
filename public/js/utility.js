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
