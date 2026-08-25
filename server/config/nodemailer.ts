// const nodemailer = require("nodemailer");
import { createTransport } from 'nodemailer'

// Create a transporter using SMTP
const transporter = createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, body }: { to: string, subject: string, body: string }) => {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body
    })
    return response
}
export default sendEmail



























// import Nodemailer from "nodemailer"
// import { MailtrapTransport } from "mailtrap"
// const TOKEN = process.env.MAILTRAP_API_KEY
// const transport = Nodemailer.createTransport(
//     MailtrapTransport({
//         token: 'a89e71a90ecdaf817da90a86fe2e2e0e',
//     })
// );

// const sender = {
//     address: "hello@demomailtrap.co",
//     name: "Mailtrap Test",
// }
// const sendEmail = async ({ to, subject, body }) => {
//     const response = await transport.sendMail({
//         from: sender,
//         to,
//         subject,
//         html: body
//     })
//     return response
// }
// export default sendEmail