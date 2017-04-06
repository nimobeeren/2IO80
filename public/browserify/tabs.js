// tab
function findParent(el, match){
    while(el.parentNode){
        el = el.parentNode;
        if(el.matches(match)){
            return el;
        }
    }
}

var tabs = document.querySelectorAll("[data-tab]");
for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function(){
        var tabsWrapper = findParent(this, '[data-tab-list]')
        var tabs = tabsWrapper.querySelectorAll("[data-tab]");
        var tabcontent = tabsWrapper.nextElementSibling.querySelectorAll("[data-tab-content]");

        closeTabs(tabs);
        closeTabs(tabcontent);

        this.classList.add("tab--open");
        document.getElementById(this.dataset.tab).classList.add("tab--open");
    });
}

function closeTabs(els){
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove("tab--open");
    }
}
