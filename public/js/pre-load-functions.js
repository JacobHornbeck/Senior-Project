/* Message Display Function */
let newMessageTimeout = null
function createMessage(content, type='error') {
    if (newMessageTimeout) {
        $($('span.close')[0]).parent().remove()
        clearInterval(newMessageTimeout)
    }
    $(`<div class="notif ${type}">
            <img src="/images/site-images/notif-${type}.png" alt="${type} notification icon">
            <span>${content}</span>
            <span class="close">×</span>
        </div>`).appendTo("body")
    
    $('span.close')?.on('click', (e) => {
        let notif = $(e.target.parentElement)
        notif.css('animation', 'notif-out 0.5s')
        setTimeout(() => {
            notif.remove()
        }, 490);
    })
    newMessageTimeout = setTimeout(() => {
        let notif = $('span.close')
        if (notif[0]) {
            notif = notif.parent()
            notif.css('animation','notif-out 0.5s')
            setTimeout(() => {
                notif.remove()
            }, 490);
        }
    }, 10000);
}
/* Message Display Function */



/* Forum Voting Frontend System */
function vote(message, direction) {
    if (!message || !direction) return false;
    if (direction === 'down') { alert("When voting down on a post, please make sure to comment and let them know the reason, to help them fix it") }
    $.ajax({
        url: '/forum/vote',
        type: "POST",
        data: {
            "_csrf": $('input[name="_csrf"]').val(),
            "messageId": message,
            "direction": direction,
        },
        success: (data) => {
            $(`#cg-${message} .votes .numVotes`).html(data.votes)
            if (data.message == 'removed') {
                $(`#cg-${message} .votes button`).removeClass('activated')
            }
            if (data.message == 'changed' || data.message == 'added') {
                $(`#cg-${message} .votes button`).removeClass('activated')
                $(`#cg-${message} .votes .${direction}`).addClass('activated')
            }
        },
        error: (jXHR) => {
            createMessage(jXHR.status == 429 ? jXHR.responseText : jXHR.responseJSON)
        }
    })
}
/* Forum Voting Frontend System */



/* Forum Commenting System */
function openCommentOnForm(id) {
    const comments = $(`#${id} .comments`)
    if (comments.hasClass('open'))
        comments.removeClass('open')
    else
        comments.addClass('open')
}
function openAnswerForm(id) {

}
/* Forum Commenting System */



/* User Account Settings */
function loadPreviewImage(el) {
    el = $(el)
    if (el.val().length > 2)
        return el.val('01')
    if (el.val() < 10)
        el.val('0'+el.val())

    let imgEl = el.parent().find('img')
        imgEl.attr('src', imgEl.attr('src').replace(/\-\d{2}/, '-'+el.val()))
}
/* User Account Settings */
