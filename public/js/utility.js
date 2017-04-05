/**
 * Makes a HTTP request to specified URL
 * @param type
 * @param url
 * @param params
 * @param success
 * @param error
 */
function openUrl(type, url, {params, success = () => {}, error = (e) => {console.log(e)}}) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        type === 'post' && xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        xhr.onreadystatechange = function () {
            this.readyState === 4 && this.status === 200 && success(this.responseText);
            this.readyState === 4 && this.status !== 200 && error(this.responseText);
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

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
