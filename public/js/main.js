const singleCommentLangs = [
    'batchfile',
    'clojure',
    'cobol',
    'erlang',
    'fortran',
    'haskell',
    'lisp',
    'matlab',
    'python',
    'ruby',
    'sass',
]
const supportedLanguages = [
    'html',
]
const editorStart = {
    "html": "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>New Project</title>\n        <style>\n            \n        </style>\n    </head>\n    <body>\n        \n    </body>\n</html>"
}

hljs.configure({
    cssSelector: 'pre',
    languages: [
        'javascript',
        'html',
        'css'
    ]
});
hljs.highlightAll();


ace.require('ace/ext/language_tools')
const aceEditorElement = $('.ace-editor')[0]
if (aceEditorElement) {
    const editorLanguage = $(aceEditorElement).data('language').toLowerCase();
    const editor = ace.edit(aceEditorElement);
    editor.setOptions({
        theme: "ace/theme/monokai",
        mode: `ace/mode/${editorLanguage}`,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
    });
    if (!editor.getValue().length > 0) {
        if (editorStart[editorLanguage]) editor.setValue(editorStart[editorLanguage], -1);
        else if (!supportedLanguages.includes(editorLanguage)) {
            editor.setValue(' You can play around with this language, but as of\n' +
                'right now, you cannot run the code you write. ', 0);

            setTimeout(() => {
                if (!singleCommentLangs.includes(editorLanguage))
                    editor.toggleBlockComment();
                else
                    editor.toggleCommentLines();
            }, 250);
        }
    }
    $('.btn.save').on('click', () => {
        $.ajax({
            url: '/user/save/project',
            type: 'POST',
            data: {
                "_csrf": $('input[name="_csrf"]').val(),
                "project-code": editor.getValue(),
                "project-language": editor.getOptions().mode.toString().replace(/(ace)\/(mode)\/(.+)/,'$3'),
                "project-title": "New Project"
            },
            success: (data) => {
                window.open(data.projectUrl, '_self')
            },
            error: (jXHR) => {
                console.log(jXHR.responseText)
                createMessage(jXHR.responseText)
            }
        })
    })
}


function addLineClass(pre) {
    var lines = pre.innerHTML.split("\n"); // can use innerHTML also
    while (pre.childNodes.length > 0) {
        pre.removeChild(pre.childNodes[0]);
    }
    for (var i = 0; i < lines.length; i++) {
        var span = document.createElement("span");
        span.className = "line";
        span.innerHTML = lines[i]; // can use innerHTML also
        pre.appendChild(span);
        pre.appendChild(document.createTextNode("\n"));
    }
}
setTimeout(() => {
    $('pre').each((i, el) => {
        addLineClass(el)
    })
}, 100);


/* Code to interact with notification */
$('span.close')?.on('click', (e) => {
    let notif = $(e.target.parentElement)
    notif.css('animation', 'notif-out 0.5s')
    setTimeout(() => {
        notif.remove()
    }, 500);
})
setTimeout(() => {
    let notif = $('span.close')
    if (notif[0]) {
        notif = notif.parent()
        notif.css('animation','notif-out 0.5s')
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
    elem = $(elem)
    if (elem.length > 0) {
        started = true
        elemLater = elem.parent().find('.valid')
        elemLater.attr('class', 'valid loading')
        elemLater.attr('title', 'Checking username')
        laterElem = elem
    }
    else {
        elemLater.attr('class', 'valid loading')
        elemLater.attr('title', 'Checking username')
    }
    if (checkNow) {
        if (laterElem.attr('id') == 'username' && laterElem.val().length >= 4 && /^[a-z0-9]{4,100}$/i.test(laterElem.val())) {
            fetch(`/username-validity?username=${elemLater.parent().find('input').val()}`)
                .then((response) => {
                    return response.json()
                })
                .then((username) => {
                    if (username.taken) {
                        elemLater.attr('title', 'That username is taken... choose another')
                        elemLater.attr('class', 'valid false')
                    }
                    else {
                        elemLater.attr('title', 'That username is available')
                        elemLater.attr('class', 'valid true')
                    }
                })
                .catch(e => {
                    console.log(e)
                    elemLater.attr('title', 'Couldn\'t check username, please try again later')
                    elemLater.attr('class', 'valid false')
                })
        }
        else if (laterElem.id == 'confirm-password' && laterElem.val().length > 0) {
            let oPass = $('#password')
            if (oPass.val() == laterElem.val()) {
                elemLater.attr('class', 'valid true')
                elemLater.attr('title', 'The passwords match')
            }
            else {
                elemLater.attr('class', 'valid false')
                elemLater.attr('title', 'The passwords don\'t match')
            }
        }
        else {
            elemLater.attr('class', 'valid false')
            switch (laterElem.id) {
                case 'username':
                    elemLater.attr('title', 'Invalid username')
                    break;
                default:
                    elemLater.attr('title', 'Invalid value')
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

$('.valid').each((i,el) => {
    let inputEl = $(el).parent().find('input')
    checkNow = true
    LoadPerCharacter(false, inputEl)
    inputEl.on('input', () => {
        LoadPerCharacter(true, inputEl)
    })
    inputEl.on('keydown', () => {
        CheckValue(inputEl)
    })
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
    let inputEl = $(elem).parent().find('input')
    inputEl.parent().find('.input-help ul li').each((i, ruleItem) => {
        ruleItem.className = (inputHelpRules[ruleItem.id].test(inputEl.val())) ? 'meets-requirements' : 'needs-work'
    })
}

$('.input-help').each((i, el) => {
    let inputEl = $(el).parent().find('input')
        inputEl.on('input', () => {
            updateInputHelpList(inputEl)
        })
})


/* Scrolling Images */
function AdjustImage() {
    let img1 = $(".hero-image")
        img1.css('backgroundPosition', `0 calc(100% + ${(window.scrollY/2)}px)`)
    let img2 = $(".last-call")
        img2.css('backgroundPosition' `0 ${(-document.body.scrollHeight/2 + 100 + window.scrollY/2)}px`)
}

if ($('main.scrolling-images').length > 0) {
    AdjustImage()
    document.body.onscroll = AdjustImage
}

const sideBySideLayoutButton = $('button.side-by-side')
const stackedLayoutButton = $('button.stacked')

if (sideBySideLayoutButton.length > 0 && stackedLayoutButton.length > 0) {
    sideBySideLayoutButton.on('click', () => {
        let playground = $('.code-playground')
        if (playground.hasClass("stacked")) {
            playground.removeClass("stacked")
            playground.addClass("side-by-side")
        }
    })
    stackedLayoutButton.on('click', () => {
        let playground = $('.code-playground')
        if (playground.hasClass("side-by-side")) {
            playground.removeClass("side-by-side")
            playground.addClass("stacked")
        }
    })
}
