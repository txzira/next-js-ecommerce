import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAILNODEMAILER_EMAIL,
    pass: process.env.GMAILNODEMAILER_PASSWORD,
  },
});

export function sendEmail(
  toEmail: any,
  toName: any,
  subject: any,
  htmlPart: any
) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      greetingTimeout: 1000 * 60 * 5,
      // ...(process.env.DEV_ENV ? { secure: false } : { secure: true }),
      auth: {
        user: process.env.GMAILNODEMAILER_EMAIL,
        pass: process.env.GMAILNODEMAILER_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.GMAILNODEMAILER_EMAIL,
      to: `"${toName}" <${toEmail}>`,
      subject: subject,
      html: htmlPart,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        resolve(false);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
}
