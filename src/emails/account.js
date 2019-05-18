const sgMail = require(`@sendgrid/mail`)//USING SENDGRID FOR EMAILS
//const sgAPIkey = `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`; //MOVED TO ENV

//LET SG KNOW OUR API KEY
sgMail.setApiKey(/*sgAPIkey*/process.env.SENDGRID_API_KEY);
//SEND INDIVIDUAL EMAILS
// sgMail.send({
//     to: `caralagumen@gmail.com`,
//     from: `caralagumen@gmail.com`,
//     subject: `node js tutorial`,
//     text: `this first test is for the task manager app`
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: `caralagumen@gmail.com`,
        subject: `Thanks for joining!`,
        text: `Welcome to the app, ${name}. I hope you enjoy, please let me know if you run into any errors. Thanks for joining!`
        //html: `type your regular html here`
    })
}

const sendDeletionEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: `caralagumen@gmail.com`,
        subject: `You have successfully deleted your account.`,
        text: `Sad to see you leave ${name}, but fortunate to have had you. Thanks for the support!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeletionEmail
}