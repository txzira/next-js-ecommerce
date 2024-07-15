import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC!,
  process.env.MJ_APIKEY_PRIVATE!
);

export function SendEmail(
  toEmail: string,
  toName: string,
  subject: string,
  htmlPart: string
) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "misterxcommerce@gmail.com",
          Name: "Mister X",
        },
        To: [
          {
            Email: toEmail,
            Name: toName,
          },
        ],
        Subject: subject,

        HTMLPart: htmlPart,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}
