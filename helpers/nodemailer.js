const nodemailer = require('nodemailer');
class Nodemailer {
    constructor() {
        this.nodemailer = nodemailer;
    }
    sendEmail(arr, inviteCode) {
        return new Promise((resolve, reject) => {
            const smtpTransport = this.nodemailer.createTransport(`smtps://${process.env.EMAIL}:${process.env.PASSWORD}@smtp.gmail.com`);
            const data = {
                from: 'Worky.ai Admin <hr.workyai@gmail.com>',
                to: arr,
                subject: `Campaign`,
                html: `<h4>Dear Applicant,</h4>
                <div>We encourage you to become a part of our hiring campaign by authorizing us with your github account.</div>
                <div>&nbsp;</div>
                <div>&nbsp;<button><a href="https://github.com/login/oauth/authorize?scope=user,repo,admin:org,gist&client_id=40821d3f8353c81ef1be&redirect_uri=http://workyfrontend.s3-website-us-east-1.amazonaws.com/thanks?uuid=${inviteCode}">Click here</a></button> to join our hiring campaign!</div>
                <div>&nbsp;</div>
                <div>You can revoke access to your github account at any time!</div>
                <div>&nbsp;&nbsp;</div>
                <p style="line-height:1">Regards,</p>
<p style="line-height:1">Team Worky</p>
<p style="line-height:1">
CreativeMorph (www.creativemorph.com)  
</p>`
            };
            smtpTransport.sendMail(data, function (error, response) {
                if (error) {
                    reject();
                } else {
                    resolve();
                }
                smtpTransport.close();
            });
        })

    }
}

module.exports = Nodemailer;
