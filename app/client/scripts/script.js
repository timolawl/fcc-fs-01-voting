'use strict';

// set up dynamic adding/removing of options from /pollform


// set up dynamic removal of polls in /mypolls

function addOption (btnCounter) {
    // need a way of keeping track of the count.
    // either way, I just add to the end of the last count, even if sparse
    const button = document.createElement('button');
    button.className = 'form__button--delete';
    button.id = `option-${btnCounter}`;
    button.textContent = 'X';

    const input = document.createElement('input');
    input.className = 'form__input form__input--options';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'options');
    input.setAttribute('placeholder', 'New Option');

    const div = document.createElement('div');
    div.className = 'form__options--option';

    div.appendChild(input)
    div.appendChild(button);

    document.querySelector('.form__options').appendChild(div);
}

window.onload = function () {
    // should separate out the functions based on path?
    // will likely need to refactor this as this seems semantically equivalent to having function declarations within conditionals.
    // delete function
    if (location.pathname.match(/\/createpoll\/?/i)) { // why does this have only 1 slash?

        let buttonCounter = 3; // initial setting since there's already 2 initially.

        document.querySelector('.form').addEventListener('click', e => {

            if (e && e.target.id.match(/^option-\d+$/)) {
                let target = document.getElementById(e.target.id).parentNode;
                target.parentNode.removeChild(target);
            }
            
            if (e && e.target.id === 'option-create') {
                e.preventDefault(); // apparently this is needed for preventing the 'requirement' popup.
                addOption(buttonCounter);
                buttonCounter++; // increment after
            }
        }); // event delegation
    }
    // create function
    
    // why does having the onclick on the button itself not work?
};


