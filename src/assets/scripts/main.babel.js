
'use strict';

// let wW = window.innerWidth;
// let wH = window.innerHeight;

let wW = document.querySelector('.device').clientWidth;
let wH = document.querySelector('.device').clientHeight;

document.addEventListener('tizenhwkey', function(e) {
    if (e.keyName == "back" || e.keyName == "menu") {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (ignore) {}
    }
});

Component.init();
Ticker.init();
