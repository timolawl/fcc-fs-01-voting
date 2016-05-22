'use strict';

// set up dynamic adding/removing of options from /pollform


// set up dynamic removal of polls in /mypolls

function addOption () {

}

if (location.href === '/createpoll') {
    
}


window.onload = function () {
    // should separate out the functions based on path
    // delete function
    if (location.pathname === '/createpoll') {
        document.querySelector('.form__options').addEventListener('click', function(e) {
            if (e && e.target.id.match(/option-\d+/)) {
                var target = document.getElementById(e.target.id).parentNode;
                target.parentNode.removeChild(target);
            }
        }); // event delegation
    }
    // create function
    
    // why does having the onclick on the button itself not work?
};


