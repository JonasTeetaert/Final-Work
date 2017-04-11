var Debugger = function () {};
Debugger.log = function (message) {
    'use strict';
    try {
        console.log(message);
    } catch (exception) {
        return;
    }
};