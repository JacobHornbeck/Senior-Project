hljs.configure({
    cssSelector: 'pre',
    languages: [
        'javascript',
        'html',
        'css',
        'python'
    ]
});
hljs.highlightAll();


/* Code to interact with notification */
document.querySelector('span.close')?.addEventListener('click', (e) => {
    let notif = e.target.parentElement
    notif.style.animation = "notif-out 0.5s"
    setTimeout(() => {
        notif.remove()
    }, 500);
})
setTimeout(() => {
    let notif = document.querySelector('span.close')
    if (notif) {
        notif = notif.parentElement
        notif.style.animation = "notif-out 0.5s"
        setTimeout(() => {
            notif.remove()
        }, 500);
    }
}, 10000);



/* Code to automate validation animation */
var checkNow = false
var elemLater = null
var laterElem = null
var timeoutSe = null
var started = false

function CheckValue(elem) {
    if (window.event.keyCode === 8) {
        LoadPerCharacter(true, elem)
    }
}

function LoadPerCharacter(tr, elem) {
    if (elem) {
        started = true
        elemLater = elem.parentElement.getElementsByClassName('valid')[0]
        elemLater.className = 'valid loading'
        elemLater.title = 'Checking username'
        laterElem = elem
    }
    else {
        elemLater.className = 'valid loading'
        elemLater.title = 'Checking username'
    }
    if (checkNow) {
        if (laterElem.id == 'username' && laterElem.value.length >= 4 && /^[a-z0-9]{4,100}$/i.test(laterElem.value)) {
            let data = new FormData()
            data.append('_csrf', document.querySelector('input[name="_csrf"]').value)
            data.append('username', elemLater.parentElement.querySelector('input').value)
            fetch('/username-validity/', { method: "POST", body: data })
                .then((response) => {
                    return response.json()
                })
                .then((username) => {
                    if (username.taken) {
                        elemLater.title = 'That username is taken... choose another'
                        elemLater.className = 'valid false'
                    }
                    else {
                        elemLater.title = 'That username is available'
                        elemLater.className = 'valid true'
                    }
                })
                .catch(e => {
                    elemLater.title = 'Couldn\'t check username, please try again later'
                    elemLater.className = 'valid false'
                })
        }
        else if (laterElem.id == 'confirm-password' && laterElem.value.length > 0) {
            let oPass = document.getElementById('password')
            if (oPass.value == laterElem.value) {
                elemLater.className = 'valid true'
                elemLater.title = 'The passwords match'
            }
            else {
                elemLater.className = 'valid false'
                elemLater.title = 'The passwords don\'t match'
            }
        }
        else {
            elemLater.className = 'valid false'
            switch (laterElem.id) {
                case 'username':
                    elemLater.title = 'Invalid username'
                    break;
                default:
                    elemLater.title = 'Invalid value'
            }
        }
        checkNow = false
    }
    if (tr) {
        clearTimeout(timeoutSe)
        timeoutSe = setTimeout(() => {
            checkNow = true
            LoadPerCharacter(false)
        }, 900)
    }
}

Array.from(document.querySelectorAll('.valid')).forEach(el => {
    let inputEl = el.parentElement.querySelector('input')
    if (inputEl.value.length > 0) {
        LoadPerCharacter(true, inputEl)
    }
})


const inputHelpRules = {
    "username-rule-1": /^[\S]{4,100}$/i,
    "username-rule-2": /^[a-z0-9]+$/i,
    "username-rule-3": /^[a-z]/i,
    "password-rule-1": /^.{8,}$/,
    "password-rule-2": /^.{0,100}$/,
    "password-rule-3": /^[a-z0-9\_\-]+$/i,
}

function updateInputHelpList(elem) {
    let inputEl = elem.parentElement.querySelector('input')
    let ruleList = Array.from(inputEl.parentElement.querySelectorAll('.input-help ul li'))
    for (let i in ruleList) {
        let ruleItem = ruleList[i]
        ruleItem.className = (inputHelpRules[ruleItem.id].test(inputEl.value)) ? 'meets-requirements' : 'needs-work'
    }
}

Array.from(document.querySelectorAll('.input-help')).forEach(el => {
    let inputEl = el.parentElement.querySelector('input')
        inputEl.addEventListener('input', () => {
            updateInputHelpList(inputEl)
        })
})


/* Scrolling Images */
function AdjustImage() {
    let img1 = document.querySelector(".hero-image")
        img1.style.backgroundPosition = `0 calc(100% + ${(window.scrollY/2)}px)`
    let img2 = document.querySelector(".last-call")
        img2.style.backgroundPosition = `0 ${(-document.body.scrollHeight/2 + 100 + window.scrollY/2)}px`
}

if (document.querySelector('main.scrolling-images')) {
    AdjustImage()
    document.body.onscroll = AdjustImage
}
