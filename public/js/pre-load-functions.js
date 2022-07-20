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
function openCommentOnForm(id, onlyCollapse = false) {
    const comments = $(`#${id} > .comments`)
    if (comments.hasClass('open') || onlyCollapse)
        comments.removeClass('open')
    else {
        comments.addClass('open')
        openAnswerForm(id, true)
    }
}
function openAnswerForm(id, onlyCollapse = false) {
    const answerForm = $(`#${id} .answerForm`)
    if (answerForm.hasClass('show') || onlyCollapse)
        answerForm.removeClass('show')
    else {
        answerForm.addClass('show')
        openCommentOnForm(id, true)
    }
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



/* User Notifications */
function openNotifications() {
    $('.notification-list').toggleClass('open')
    if ($('.notification-list').hasClass('open')) {
        setTimeout(openNotifications, 10000);
        if ($('.notification-list').text() == 'notifications_active') {
            fetch('/mark-as-read')
                .then((response) => {
                    return response.json()
                })
                .then((jsonData) => {
                    if (jsonData.status == 'success') {
                        $('.notifToggle').text('notifications')
                        return true
                    }
                    else {
                        console.log(jsonData.message)
                        createMessage('Couldn\'t mark as read, please try again later')
                    }
                })
        }
    }
}
/* User Notifications */
