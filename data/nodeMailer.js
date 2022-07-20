require('dotenv').config()
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const fromEmail = 'genius-coding@outlook.com'
const transporter = nodemailer.createTransport(sendgridTransport({ auth: { api_key: process.env.mailerAPI } }))

/**
 * Send an email
 * @param {string} to Recipient's email
 * @param {string} from Sender name
 * @param {string} subject Subject of email
 * @param {string} content Email content
 * @returns mail transporter promise
 */
const sendEmail = (to, from, subject, content) => {
    return transporter.sendMail({
        to: to,
        from: `${from}<${fromEmail}>`,
        subject: subject,
        html: content
    })
}
const template = (heading, content) => {
    return `<div style="width: 95%; max-width: 800px; margin: 0 auto;">
                <img src="https://genius-coding.herokuapp.com/images/site-images/email-banner.png" alt="Genius Coding Email Banner"
                style="width: 100%; height: 60px; object-fit: cover; object-position: left;">
                <h2 style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">${heading}</h2>
                ${content}
            </div>`
}
const template2 = (heading, content) => {
    return `<div style="width: 95%; max-width: 800px; margin: 0 auto;">
                <img src="https://genius-coding.herokuapp.com/images/site-images/email-banner.png" alt="Genius Coding Email Banner"
                style="width: 100%; height: 60px; object-fit: cover; object-position: left;">
                <h2>${heading}</h2>
                ${content}
            </div>`
}

exports.AccountCreated = (to, name, confirmationLink) => {
    return sendEmail(
        to,
        'Account Management',
        'Account Creation Successful!',
        template("Account Created!",
            `<p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">${name}, you successfully signed up for an account!</p>
            <p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
                You must <a href="${confirmationLink}">confirm your email</a>
                before you can login.<br>This link will expire in 12 hours.
            </p>`))
}

exports.EmailChanged = (to, name, emailTo) => {
    return sendEmail(
        to,
        'Account Management',
        'Email Has Been Changed',
        template("Account Email Changed!",
            `<p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
                ${name}, the email connected to your account was changed to ${emailTo}. If
                you didn't request this change, please contact support as soon as possible.
            </p>`))
}

exports.NewEmailConfirmation = (to, name, confirmationLink) => {
    return sendEmail(
        to,
        'Account Management',
        'New Email Confirmation',
        template("Account Email Changed!",
            `<p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
                ${name}, an account at Genius Coding, just had it's email changed
                to this one. If you did not change it, please contact support.
            </p>
            <p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
                If you did change the email, please <a href="${confirmationLink}">confirm
                your email</a> so you can login again.<br>This link will expire in 12 hours.
            </p>`))
}

exports.AccountUpdated = (to, name) => {
    return sendEmail(
        to,
        'Account Management',
        'Account Info Updated',
        template("Account Info Changed!",
            `<p style="text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
                ${name}, some of your account info has been changed.
                If the email was changed, you will get another email letting you know.<br>
                If you did not request these changes, please contact support.
            </p>`))
}

exports.ForumNotification = (to, name, messageFrom, linkTo, messageContent) => {
    return sendEmail(
        to,
        'Notification Service',
        `New Message from ${messageFrom}`,
        template2(`Hello, ${name}!`, `
            <p>${messageFrom} has posted a message (comment, question, or answer) somewhere you are subscribed to. <a href="${process.env.NODE_ENV == 'develop' ? `http://localhost:${process.env.PORT}` : 'https://genius-coding.herokuapp.com'}/${linkTo}">Click here</a> to view the message</p>
            ${messageContent ? `<div style="padding: 0.5rem; box-shadow: 2px 2px 5px gray;">${messageContent}</div>` : ''}<br>
            <p>To change your notification settings, go to your <a href="${process.env.NODE_ENV == 'develop' ? `http://localhost:${process.env.PORT}` : 'https://genius-coding.herokuapp.com'}/user/account-settings">account settings</a></p>`)
    )
}

exports.RequestData = (to, dataList) => {
    return sendEmail(
        to,
        'Account Management',
        'Your Data Request',
        template2("Your Data",
            `<p>
                You have requested your data. The following data is
                what you provided to us and that we currently have
                stored on our database.
            </p>
            <p>
                ${dataList}
            </p>
            <p>
                Just another reminder, this request does <em>not</em>
                take out your data, this is just a copy. To remove
                your data from our database, you will need to delete
                your account, which you can do on your
                <a href="https://genius-coding.herokuapp.com/user/account-settings">
                settings page</a>.
            </p>`)
    )
}
