import nodemailer from "nodemailer";
import db from "@prisma/client";
const prisma = new db.PrismaClient();

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
  var mailOptions = {
    from: process.env.GMAILNODEMAILER_EMAIL,
    to: `"${toName}" <${toEmail}>`,
    subject: subject,
    html: htmlPart,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
