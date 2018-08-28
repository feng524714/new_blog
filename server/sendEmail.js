const nodemailer = require('nodemailer')
const {SUBSCRIBE_USERS, EmailAuth} = require('../config') // Subscribe user email

const transporter = nodemailer.createTransport({
  // service: 'hotmail',
  service: 'QQ',
  port: 465,
  secure: false, // true for 465, false for other ports
  auth: EmailAuth,
})

const mailOptions = {
  from: `权川的个人网站 <${EmailAuth.user}>`, // sender address
  to: '603803799@qq.com', // list of receivers
  // bcc: SUBSCRIBE_USERS.join(','),
  subject: 'Hello world', // Subject line
  text: 'Hello world', // plain text body
  // html: '<b>Hello world</b>', // html body
}

module.exports = option => {

  mailOptions.form = `${option.title} <${EmailAuth.user}>`
  mailOptions.subject = option.subject
  mailOptions.text = `
  ${option.stdout}
  ${option.name}\n
  ${option.repository}\n
  ${option.branch}\n
  ${option.message}\n
 `
  mailOptions.bcc = option.bcc

  return transporter.sendMail(mailOptions,
    (error, info) => {
      if (error) {
        console.error(error)
      } else {
        option.callback && option.callback(info)
      }
    })
}
