import info from './config/index.mjs'
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = info

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendMailer = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'dulieu.vblc@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: 'Hê hê',
            to: 'noxaov.real@gmail.com',
            subject: 'Test',
            text: 'Test',
            html: '<h1>Test</h1>'
        }
        const result = await transport.sendMail(mailOptions)
        return result;
    } catch (e) {
        return e
    }
}

sendMailer().then(result => console.log('Email sent...', result)).catch(error => console.log(error.message))
