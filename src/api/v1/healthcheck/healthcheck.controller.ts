import {Request, Response} from "express";
import mailer from "../../../mailer";

const healthcheck = (req: Request, res: Response) => {
  res.status(200).send('API is up and running!');
};

const mailTest = (req: Request, res: Response) => {
  let body = req.body;
  mailer(body.to, body.credentials);
  res.status(200).send('Mail sent!');
}

export {healthcheck, mailTest};
