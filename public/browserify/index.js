'use strict';

require("svg4everybody");

require("./filter.js");

// footer
document.getElementById("scroll-to-top").addEventListener("click", function(){
    window.scrollTo(0, 0);
});

// (poly) details + summary
var toggleButtons = document.querySelectorAll("[data-toggle]");
for (var i = 0; i < toggleButtons.length; i++) {
    var button = toggleButtons[i];
    button.addEventListener("click", function(){
        var linkedId = this.dataset.toggle;

        document.getElementById(linkedId).classList.toggle("toggle--open");
    });
}

// menu
var toggleMenu = document.querySelector("[data-menu-toggle]");
var closeMenu = document.querySelector("[data-menu-close]");

toggleMenu.addEventListener("click", function(){
    document.getElementById("nav").classList.toggle("menu--open");
});
closeMenu.addEventListener("click", function(){
    document.getElementById("nav").classList.remove("menu--open");
});
