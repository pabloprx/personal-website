import { Resend } from "resend";

const resend = new Resend("re_dUauTSsV_BM2NaZNc9Ljox4WiycpmVsB6");

export const sendEmail = async ({ name, email, message, toEmail }: any) => {
  return await resend.emails.send({
    from: "contacto@pablodev.cl",
    to: toEmail,
    replyTo: email,
    subject: "Nuevo correo de contacto",
    html: `<p>${name} te ha enviado un correo</p><p><strong>Mensaje:</strong> ${message}</p>`,
  });
};
