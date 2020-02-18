import * as functions from 'firebase-functions';
import sgMail = require("@sendgrid/mail");
import * as dotenv from 'dotenv';
import {factory} from "./ConfigLog4j";

dotenv.config();

sgMail.setApiKey(process.env.API_KEY_SEND_GRID || " ");

const log = factory.getLogger("functions.sendmail");

export const sendmail = functions.https.onRequest((request, response) => {

    let {from, to, subject, text} = request.body;
    from = emailIsValid(from) ? from : " ";
    to = emailIsValid(to) ? to : " ";
    subject = validateLength(subject, 30);
    text = validateLength(text, 150);

    sgMail.send({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: "<p>This is a test email</p>"
    }).then(() => {
        response.sendStatus(200);
        log.info(() => `Sent email from: ${from} - to: ${to}`);

    }, err => {
        log.error(() => err);
        response.sendStatus(404);
    });

});

function emailIsValid(email: string) {
    return /\S+@\S+\.\S+/.test(email)
}

function validateLength(val: string, length: number) {
    return val.length > length ? val.substring(0, length) : val;
}
