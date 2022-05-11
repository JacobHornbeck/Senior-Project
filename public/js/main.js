/* Code to interact with notification */
document.querySelector('span.close')?.addEventListener('click', (e) => {
    let notif = e.target.parentElement
    notif.style.animation = "notif-out 0.5s"
    setTimeout(() => {
        notif.remove()
    }, 501);
})