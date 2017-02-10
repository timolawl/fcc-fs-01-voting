'use strict';



// set up dynamic adding/removing of options from /pollform


// set up dynamic removal of polls in /mypolls

function addOption (btnCounter) {
    // need a way of keeping track of the count.
    // either way, I just add to the end of the last count, even if sparse
    const button = document.createElement('button');
    button.className = 'form__button--delete';
    button.id = `option-${btnCounter}`; // es6 template literal
    button.type = 'button';
    button.textContent = 'X';

    const input = document.createElement('input');
    input.className = 'form__input form__input--options';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'options');
    input.setAttribute('placeholder', 'New Option');
    input.setAttribute('pattern', '^[a-zA-Z0-9][a-zA-Z0-9_/ .?-]{0,200}$');

    const div = document.createElement('div');
    div.className = 'form__options--option';

    div.appendChild(input)
    div.appendChild(button);

    document.querySelector('.form__options').appendChild(div);
}

function checkForm (path) {
    // on form change or on group of input change, test
    const form = document.querySelector('form');
    // need live nodelist since add/deleting:
    const inputs = document.getElementsByClassName('form__input');
    const submitBtn = document.querySelector('input[type="submit"]');
    submitBtn.disabled = true;
    //const inherentBtnColor = submitBtn.style.background;
    //submitBtn.style.background = 'gray';
    // better way would be to fade it out with a blend? overlay?

    function validateInput () {
        let unique, pw, pwConfirm;

        submitBtn.disabled = true;

        if (Array.from(inputs).every(input => input.value.match(input.getAttribute('pattern')))) {
            if (path === 'createpoll' && inputs.length >= 3) {
                unique = new Set(Array.from(inputs).map(input => input.value));
                if (inputs.length === unique.size)
                    submitBtn.disabled = false;
            }
            else if (path !== 'createpoll') {
                if (path === 'signup') {
                    pw = form.querySelector('.form__input--password');
                    pwConfirm = form.querySelector('.form__input--confirm');
                    if (pw.value === pwConfirm.value) {
                        pw.style.outline = 'initial';
                        pwConfirm.style.outline = 'initial';
                        submitBtn.disabled = false;
                    }
                    else {
                        pw.style.outline = '1px solid red';
                        pwConfirm.style.outline = '1px solid red';
                    }
                }
                else submitBtn.disabled = false;
            }
        }
    }
    form.onkeyup = validateInput;
    form.onclick = validateInput;
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

            // create function
            if (e && e.target.id === 'option-create') {
                e.preventDefault(); // apparently this is needed for preventing the 'requirement' popup.
                addOption(buttonCounter);
                buttonCounter++; // increment after
            }
        }); // event delegation
    }
    
    if (location.pathname.match(/\/(?:signup|login|reset|createpoll)\/?/i)) {
        // clear out form
        document.querySelector('form').reset();
        // gray out submit button until everything is filled in.
        checkForm(location.pathname.toLowerCase().slice(1));
    }

    if (location.pathname.match(/\/poll\/[0-9a-f-]+$/)) {
        console.log('on that nonce page');

       // Chart.defaults.global.elements.arc.backgroundColor = 'rgba(0,0,0,0.3)';
       // Chart.defaults.global.elements.arc.borderColor = 'rgba(0,0,0,1)';
       // Chart.defaults.global.elements.arc.borderWidth = 2;
       // Chart.defaults.global.layout.padding = 5;

        var ctx = document.querySelector('.createdPoll');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: [
                'The Chronicles of Narnia',
                'Harry Potter',
                'Dragonlance',
                'Forgotten Realms',
                'Star Wars',
                'Magic: The Gathering',
                'Warcraft',
                'Starcraft',
                'Dune',
                'Dan Brown\'s books',
                'Hi Dave',
                'I need more book series'
              ],
              datasets: [{
                data: [1,2,3,4,5,6,7,8,9,10,11,12],
                backgroundColor: [
                  '#8DD3C7',
                  '#FFFFB3',
                  '#BEBADA',
                  '#FB8072',
                  '#80B1D3',
                  '#FDB462',
                  '#B3DE69',
                  '#FCCDE5',
                  '#D9D9D9',
                  '#BC80BD',
                  '#CCEBC5',
                  '#FFED6F'
                ]
              }] 
            },
            options: {
              title: {
                display: true,
                fontSize: 14,
                text: 'What is your favorite book series?'
              },
              legend: {
                position: 'bottom',
              //  boxWidth: 10
              }
              /*
              layout: {
                padding: 5
              }
              */
            }
        });


    }

    // why does having the onclick on the button itself not work?
};


