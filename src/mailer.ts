import nodemailer from "nodemailer";
import { mailConfig } from "./config/appConfig";
import { appLogger, errorLogger } from "./logging/log";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: mailConfig.auth,
});

/**
 * Credentials interface.
 */
interface Credentials {
    domain: string;
    user: string;
    password: string;
    name: string;
    status: string;
    message: string;
    }

/**
 * Send mail with credentials to the user.
 *
 * @param to string
 *   The email address of the user.
 * @param credentials Credentials
 *  The credentials of the user.
 */
async function mailer(to: string, credentials: Credentials) {
  async function sendMailAndHandleResponse(to: string, data: string, credentials: any) {
    const info = await transporter.sendMail({
      from: `"WissKI Cloud" <${mailConfig.auth.user}>`, // sender address
      to: to, // list of receivers
      subject: "Your WissKI Cloud Instance Credentials", // Subject line
      html: data, // html body
    });

    if (!info.messageId) {
      errorLogger.error(`Could not send message concerning ${credentials.domain} to ${to}.`);
      return {
        status: 'error',
        message: 'Message not sent.',
      }
    }

    appLogger.info(`Sent message with credentials of ${credentials.domain} to ${to}.`);
    return {
      status: 'success',
      message: 'Message sent: ' + info.messageId,
    }
  }

  try {
    if (credentials.status === 'success') {
      const mailTemplate = path.join(__dirname, 'templates', 'credentialMail.ejs');
      ejs.renderFile(mailTemplate, { credentials }, async function (err, data) {
        if (err) {
          errorLogger.error(`Could not render template for ${credentials.domain}. ${err}`);
        } else {
          return await sendMailAndHandleResponse(to, data, credentials);
        }
      });
    } else {
      const mailTemplate = path.join(__dirname, 'templates', 'errorMail.ejs');
      ejs.renderFile(mailTemplate, { credentials }, async function (err, data) {
        if (err) {
          errorLogger.error(`Could not render template for ${credentials.domain}. ${err}`);
        } else {
          return await sendMailAndHandleResponse(to, data, credentials);
        }
      });
    }
  } catch (error) {
    appLogger.error(`Could not send message concerning ${credentials.domain} to ${to}. ${error}`);
  }
}

export default mailer;
